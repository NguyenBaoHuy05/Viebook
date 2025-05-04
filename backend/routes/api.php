<?php

use App\Http\Controllers\AccountController;
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
Route::middleware('auth:sanctum')->post('/posts/{post}/react', [PostController::class, 'toggleReact']);
Route::middleware('auth:sanctum')->post('/posts', [PostController::class, 'createPost']);
Route::middleware('auth:sanctum')->get('/posts', [PostController::class, 'index']);
Route::middleware('auth:sanctum')->post('/posts/{post}/comments', [CommentController::class, 'createComment']);
Route::middleware('auth:sanctum')->get('/posts/{post}/comments', [CommentController::class, 'index']);
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json([
        'user' => [
            'id' => $request->user()->id,
            'username' => $request->user()->username,
        ]
    ]);
});
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/{userId}/send', [MessageController::class, 'sendMessage']);
    Route::get('/{conversationId}/messages', [MessageController::class, 'getMessages']);
    Route::delete('/messages/{id}/{check}', [MessageController::class, 'destroy']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/account/{username}', [AccountController::class, 'show']);
    Route::put('/account/{username}', [AccountController::class, 'update']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/follow', [FollowController::class, 'follow']);
    Route::get('/follow', [FollowController::class, 'checkFollow']);
    Route::delete('/follow', [FollowController::class, 'unfollow']);
});
// Route::middleware(['auth:sanctum', 'verified'])->group(function () {

//     Route::post('users/{user}/follow', [FollowController::class, 'follow']);
//     Route::delete('users/{user}/follow', [FollowController::class, 'unfollow']);
//     Route::get('users/{user}/followers', [FollowController::class, 'followers']);
//     Route::post('notifications', [NotificationController::class, 'store']);
//     Route::get('notifications', [NotificationController::class, 'index']);
//     Route::put('notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
// });
