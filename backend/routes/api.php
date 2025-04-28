<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PostReactController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NotificationController;
use Illuminate\Auth\Events\Verified;
use App\Models\User;

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
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/{userId}/send', [MessageController::class, 'sendMessage']);
    Route::get('/{conversationId}/messages', [MessageController::class, 'getMessages']);
});
Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::post('users/{user}/follow', [FollowController::class, 'follow']);
    Route::delete('users/{user}/follow', [FollowController::class, 'unfollow']);
    Route::get('users/{user}/followers', [FollowController::class, 'followers']);
    Route::post('notifications', [NotificationController::class, 'store']);
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::put('notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
});
