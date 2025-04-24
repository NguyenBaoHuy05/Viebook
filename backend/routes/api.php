<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PostReactController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\NotificationController;
use Illuminate\Auth\Events\Verified;
use App\Models\User;

// // Xóa middleware 'auth:sanctum'
// Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {
//     $user = User::findOrFail($id);

//     if (!$request->hasValidSignature()) {
//         return response()->json(['message' => 'Invalid or expired verification link'], 400);
//     }

//     if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
//         return response()->json(['message' => 'Invalid verification link'], 400);
//     }

//     if ($user->hasVerifiedEmail()) {
//         return response()->json(['message' => 'Email already verified'], 400);
//     }

//     if ($user->markEmailAsVerified()) {
//         event(new Verified($user));
//     }

//     // Trả về thông điệp xác minh thành công
//     return response()->json(['message' => 'Verified email completed'], 200);
// })->name('verification.verify');
// Route::post('/email/resend', function (Request $request) {
//     $validated = $request->validate([
//         'email' => 'required|email|exists:users,email',
//     ]);

//     $user = User::where('email', $validated['email'])->first();

//     if ($user->hasVerifiedEmail()) {
//         return response()->json(['message' => 'Email already verified'], 400);
//     }

//     $user->sendEmailVerificationNotification();

//     $timeEnd = 60; // Thời gian hết hạn của link (phù hợp với CustomVerifyEmail)
//     return response()->json(['message' => 'Verification email resent. The link expires in ' . $timeEnd . ' minutes.']);
// });
// Route::middleware('auth:sanctum')->get('/email/verified', function (Request $request) {
//     return response()->json([
//         'verified' => $request->user()->hasVerifiedEmail(),
//     ]);
// });


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forget', [AuthController::class, 'forget'])->middleware('throttle:5,60');
Route::post('/reset', [AuthController::class, 'reset'])->name('password.reset');
Route::post('/verify-email', [AuthController::class, 'verifyEmail'])->name('verification.verify');
Route::post('/resend-verification', [AuthController::class, 'resendVerification']);
Route::post('/posts', [PostController::class, 'createPost']);
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json([
        'user' => [
            'id' => $request->user()->id,
            'name' => $request->user()->name,   
            'email' => $request->user()->email,
        ]
    ]);
});
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    // Route::apiResource('posts', PostController::class);
    // Route::post('posts/{post}/react', [PostReactController::class, 'store']);
    // Route::delete('posts/{post}/react', [PostReactController::class, 'destroy']);
    // Route::post('posts/{post}/comments', [CommentController::class, 'store']);
    // Route::get('posts/{post}/comments', [CommentController::class, 'index']);
    Route::post('users/{user}/follow', [FollowController::class, 'follow']);
    Route::delete('users/{user}/follow', [FollowController::class, 'unfollow']);
    Route::get('users/{user}/followers', [FollowController::class, 'followers']);
    Route::post('notifications', [NotificationController::class, 'store']);
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::put('notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
});
