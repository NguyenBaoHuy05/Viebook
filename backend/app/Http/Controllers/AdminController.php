<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Comment;
use App\Models\PostReact;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    public function getAllUsers()
    {
        $retry = 0;
        while ($retry < 3) {
            try {
                $users = User::orderByDesc('count_follower')
                    ->orderByDesc('count_friend')
                    ->get();
                return response()->json($users);
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['users' => null, 'error' => 'Server error'], 500);
                }
                usleep(200000);
            }
        }
    }

    public function getAllPosts()
    {
        $retry = 0;
        while ($retry < 3) {
            try {
                $posts = Post::with('user:id,name')
                    ->orderByDesc('share_count')
                    ->orderByDesc('comment_count')
                    ->orderByDesc('react_count')
                    ->get();
                return response()->json($posts);
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['posts' => null, 'error' => 'Server error'], 500);
                }
                usleep(200000);
            }
        }
    }

    public function blockUser(Request $request)
    {
        $retry = 0;
        while ($retry < 3) {
            try {
                $user = User::find($request->id);
                if (!$user) {
                    return response()->json(['error' => 'Người dùng không tồn tại'], 404);
                }

                if ($user->role === 'admin') {
                    return response()->json(['error' => 'Không thể block admin'], 403);
                }
                Log::info("block:" . $request->is_blocked);
                $user->update(['block' => $request->is_blocked]);
                return response()->json(['message' => 'Cập nhật trạng thái thành công']);
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['error' => 'Server error'], 500);
                }
                usleep(200000);
            }
        }
    }

    public function statisticsOverview(Request $request)
    {
        $retry = 0;
        while ($retry < 3) {
            try {
                $user = $request->user();
                if (!$user || $user->role != 'admin') {
                    return response()->json(['message' => 'Bạn không phải admin'], 403);
                }


                $memberToday = User::whereDate('created_at', now()->toDateString())->count();
                $memberPast = User::whereDate('created_at', now()->subDay()->toDateString())->count();

                $postToday = Post::whereDate('created_at', now()->toDateString())->count();
                $postPast = Post::whereDate('created_at', now()->subDay()->toDateString())->count();

                $commentToday = Comment::whereDate('created_at', now()->toDateString())->count();
                $commentPast = Comment::whereDate('created_at', now()->subDay()->toDateString())->count();

                $contactToday = PostReact::whereDate('created_at', now()->toDateString())->count();
                $contactPast = PostReact::whereDate('created_at', now()->subDay()->toDateString())->count();

                $memberTotal = User::count();
                $postTotal = Post::count();
                $commentTotal = Comment::count();
                $contactTotal = PostReact::count();

                return response()->json([
                    'result' => [
                        'member' => [
                            'today' => $memberToday,
                            'past' => $memberPast,
                            'total' => $memberTotal,
                        ],
                        'post' => [
                            'today' => $postToday,
                            'past' => $postPast,
                            'total' => $postTotal,
                        ],
                        'comment' => [
                            'today' => $commentToday,
                            'past' => $commentPast,
                            'total' => $commentTotal,
                        ],
                        'contact' => [
                            'today' => $contactToday,
                            'past' => $contactPast,
                            'total' => $contactTotal,
                        ],
                    ]
                ]);
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['error' => 'Server error'], 500);
                }
                usleep(200000);
            }
        }
    }
    public function getCountUserDay(Request $request)
    {
        $retry = 0;
        while ($retry < 3) {
            try {
                $user = $request->user();
                if (!$user || $user->role != 'admin') {
                    return response()->json(['message' => 'Bạn không phải admin'], 403);
                }
                $lastDays = (int) $request->query('last_days', 90);
                if ($lastDays <= 0)
                    $lastday = 90;
                if ($lastDays > 365)
                    $lastday = 365;
                $endDate = Carbon::now()->endOfDay();
                $startDate = Carbon::now()->subDays($lastDays - 1)->startOfDay();
                $dailyCounts = User::select(
                    // Sử dụng DB::raw để chọn chỉ phần ngày của cột created_at, đặt tên là 'date'
                    DB::raw('DATE(created_at) as date'),
                    // Sử dụng DB::raw để đếm số bản ghi trong mỗi nhóm, đặt tên là 'users'
                    DB::raw('count(*) as users')
                )
                    // Lọc các bài viết có thời gian tạo nằm trong khoảng từ $startDate đến $endDate
                    ->whereBetween('created_at', [$startDate, $endDate])
                    // Nhóm các kết quả theo ngày (đã chọn ở trên)
                    ->groupBy(DB::raw('DATE(created_at)'))
                    // Sắp xếp kết quả theo ngày tăng dần để biểu đồ hiển thị đúng trình tự thời gian
                    ->orderBy('date', 'ASC')
                    // Thực thi truy vấn và lấy kết quả dưới dạng Collection các object
                    ->get();

                // Sử dụng CarbonPeriod để tạo ra một dãy các đối tượng ngày từ startDate đến endDate
                $period = CarbonPeriod::create($startDate->format('Y-m-d'), $endDate->format('Y-m-d'));

                $dataByDate = [];
                foreach ($period as $date) {
                    $dataByDate[$date->format('Y-m-d')] = [
                        'date' => $date->format('Y-m-d'),
                        'users' => 0,
                    ];
                }

                // Điền số lượng bài viết thực tế từ kết quả truy vấn vào map đã tạo
                // $dailyCounts chứa các object có 'date' (chuỗi Y-m-d) và 'users' (số đếm)
                foreach ($dailyCounts as $count) {
                    if (isset($dataByDate[$count->date])) {
                        $dataByDate[$count->date]['users'] = $count->users;
                    }
                }

                // Chuyển map thành một mảng tuần tự các object để trả về cho frontend
                $formattedData = array_values($dataByDate);

                return response()->json($formattedData);
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['error' => 'Server error'], 500);
                }
                usleep(200000);
            }
        }
    }
    public function getCountPostDay(Request $request)
    {
        $retry = 0;
        while ($retry < 3) {
            try {
                $user = $request->user();
                if (!$user || $user->role != 'admin') {
                    return response()->json(['message' => 'Bạn không phải admin'], 403);
                }

                $lastDays = (int) $request->query('last_days', 90);
                if ($lastDays <= 0)
                    $lastday = 90;
                if ($lastDays > 365)
                    $lastday = 365;
                $endDate = Carbon::now()->endOfDay();
                $startDate = Carbon::now()->subDays($lastDays - 1)->startOfDay();
                $dailyCountsPost = User::select(
                    // Sử dụng DB::raw để chọn chỉ phần ngày của cột created_at, đặt tên là 'date'
                    DB::raw('DATE(created_at) as date'),
                    // Sử dụng DB::raw để đếm số bản ghi trong mỗi nhóm, đặt tên là 'users'
                    DB::raw('count(*) as posts')
                )
                    // Lọc các bài viết có thời gian tạo nằm trong khoảng từ $startDate đến $endDate
                    ->whereBetween('created_at', [$startDate, $endDate])
                    // Nhóm các kết quả theo ngày 
                    ->groupBy(DB::raw('DATE(created_at)'))
                    ->orderBy('date', 'ASC')
                    ->get();
                $dailyCountsComment = Comment::select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('count(*) as comments')
                )
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->groupBy(DB::raw('DATE(created_at)'))
                    ->orderBy('date', 'ASC')
                    ->get();
                $dailyCountsLike = PostReact::select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('count(*) as likes')
                )
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->groupBy(DB::raw('DATE(created_at)'))
                    ->orderBy('date', 'ASC')
                    ->get();
                $period = CarbonPeriod::create($startDate->format('Y-m-d'), $endDate->format('Y-m-d'));

                $dataByDate = [];
                foreach ($period as $date) {
                    $dataByDate[$date->format('Y-m-d')] = [
                        'date' => $date->format('Y-m-d'),
                        'posts' => 0,
                        'comments' => 0,
                        'likes' => 0,
                    ];
                }
                foreach ($dailyCountsPost as $count) {
                    if (isset($dataByDate[$count->date])) {
                        $dataByDate[$count->date]['posts'] = $count->posts;
                    }
                }
                foreach ($dailyCountsComment as $count) {
                    if (isset($dataByDate[$count->date])) {
                        $dataByDate[$count->date]['comments'] = $count->comments;
                    }
                }
                foreach ($dailyCountsLike as $count) {
                    if (isset($dataByDate[$count->date])) {
                        $dataByDate[$count->date]['likes'] = $count->likes;
                    }
                }
                $formattedData = array_values($dataByDate);

                return response()->json($formattedData);
            } catch (\Exception $e) {
                $retry++;
                if ($retry >= 3) {
                    return response()->json(['error' => 'Server error'], 500);
                }
                usleep(200000);
            }
        }
    }
}
