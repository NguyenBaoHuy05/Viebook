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

class AdminController extends Controller
{
    public function getAllUsers()
    {
        $users = User::orderByDesc('count_follower') // Sắp xếp lượt follow giảm dần
            ->orderByDesc('count_friend') // Sau đó sắp xếp lượt friend giảm dần
            ->get();

        return response()->json($users);
    }

    public function getAllPosts()
    {
        $posts = Post::with('user:id,name')
            ->orderByDesc('share_count') // Sắp xếp lượt share giảm dần
            ->orderByDesc('comment_count') // Sau đó sắp xếp lượt comment giảm dần
            ->orderByDesc('react_count') // Cuối cùng sắp xếp lượt react giảm dần
            ->get();
        return response()->json($posts);
    }

    public function updateBlock(Request $request, User $user)
    {
        if ($user->role === 'admin') {
            return response()->json(['error' => 'Không thể block admin'], 403);
        }

        $isBlocked = filter_var($request->input('is_blocked'), FILTER_VALIDATE_BOOLEAN);
        $user->is_blocked = $isBlocked;
        $user->save();

        return response()->json(['message' => 'Cập nhật trạng thái thành công']);
    }

    public function statisticsOverview(Request $request)
    {
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

        return response()->json(['result' => [
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
        ]]);
    }
    public function getCountUserDay(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->role != 'admin') {
            return response()->json(['message' => 'Bạn không phải admin'], 403);
        }
        $lastDays = (int) $request->query('last_days', 30);
        if ($lastDays <= 0) $lastday = 30;
        if ($lastDays > 365) $lastday = 365;
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

        // Tạo một mảng kết hợp (associative array) hoặc map để lưu số lượng bài viết theo ngày
        // Khởi tạo số lượng bài viết cho mỗi ngày trong khoảng là 0
        $dataByDate = [];
        foreach ($period as $date) {
            $dataByDate[$date->format('Y-m-d')] = [
                'date' => $date->format('Y-m-d'), // Định dạng lại ngày tháng cho phù hợp frontend? Hoặc giữ Y-m-d và format ở frontend
                'users' => 0,
            ];
        }

        // Điền số lượng bài viết thực tế từ kết quả truy vấn vào map đã tạo
        // $dailyCounts chứa các object có 'date' (chuỗi Y-m-d) và 'users' (số đếm)
        foreach ($dailyCounts as $count) {
            // Dùng count->date làm key để truy cập đúng ngày trong map
            if (isset($dataByDate[$count->date])) { // Đảm bảo ngày tồn tại trong map (phòng trường hợp lệch múi giờ nhỏ)
                $dataByDate[$count->date]['users'] = $count->users;
            }
        }

        // Chuyển map thành một mảng tuần tự các object để trả về cho frontend
        // Frontend mong đợi mảng dạng [{ date: '...', users: ... }, ...]
        $formattedData = array_values($dataByDate);

        // 6. Trả về dữ liệu đã định dạng dưới dạng JSON response
        return response()->json($formattedData);
    }
}
