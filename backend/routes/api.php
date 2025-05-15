<?php

use App\Http\Controllers\AccountController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PostReactController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NotificationController;
use Illuminate\Auth\Events\Verified;
use App\Models\User;
use App\Http\Controllers\AdminController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forget', [AuthController::class, 'forget'])->middleware('throttle:5,60');
Route::post('/reset', [AuthController::class, 'reset'])->name('password.reset');
Route::post('/verify-email', [AuthController::class, 'verifyEmail'])->name('verification.verify');
Route::post('/resend-verification', [AuthController::class, 'resendVerification']);
Route::middleware('auth:sanctum')->post('/posts/{post}/react', [PostController::class, 'toggleReact']);
Route::middleware('auth:sanctum')->post('/posts', [PostController::class, 'createPost']);
Route::middleware('auth:sanctum')->get('/posts', [PostController::class, 'index']);
Route::middleware('auth:sanctum')->post('/posts/{post}/comment', [CommentController::class, 'createComment']);
Route::middleware('auth:sanctum')->get('/posts/{post}/comments', [CommentController::class, 'index']);
Route::get('/posts/{post}', [PostController::class, 'getPostWithID']);
Route::get('/posts/{post}/getReact', [PostController::class, 'getReact']);
Route::get('/comments/{id}', [CommentController::class, 'getCommentById']);
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json([
        'user' => [
            'id' => $request->user()->id,
            'username' => $request->user()->username,
            'role' => $request->user()->role,
            'name' => $request->user()->name,
            'avatar' => $request->user()->profile_picture,
        ]
    ]);
});
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/{userId}/send', [MessageController::class, 'sendMessage']);
    Route::get('/{conversationId}/messages', [MessageController::class, 'getMessages']);
    Route::delete('/messages/{id}/{check}', [MessageController::class, 'destroy']);
    Route::post('/conversation', [MessageController::class, 'getOrCreateConversation']);
    Route::get('/allConversationPrivate', [MessageController::class, 'getAllConversationsPrivate']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/account/{username}', [AccountController::class, 'show']);
    Route::put('/account/{username}', [AccountController::class, 'update']);
    Route::get('/searchUsers', [AccountController::class, 'searchUsers']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/follow', [FollowController::class, 'follow']);
    Route::get('/follow', [FollowController::class, 'checkFollow']);
    Route::delete('/follow', [FollowController::class, 'unfollow']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/friends', [FriendController::class, 'getStatusFriend']);
    Route::post('/friends/add', [FriendController::class, 'addFriend']);
    Route::delete('/friends/{friend_id}', [FriendController::class, 'deleteFriend']);
    Route::get('/friends/pendingList', [FriendController::class, 'getPendingFriendList']);
    Route::put('/friends/acceptFriend', [FriendController::class, 'acceptFriend']);
    Route::get('/friends/friendList', [FriendController::class, 'getFriendsList']);
    Route::get('/friends/friendInfo', [FriendController::class, 'getInfoFriend']);
    Route::post('/friends/blockFriend', [FriendController::class, 'blockFriend']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/notification/getAllNotification', [NotificationController::class, 'getAllNotification']);
    Route::post('/notification/changeRedDot', [NotificationController::class, 'changeIsRead']);
});
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/admin/users', [AdminController::class, 'getAllUsers']);
    Route::get('/admin/posts', [AdminController::class, 'getAllPosts']);
    // Route::put('/admin/users/role', [AdminController::class, 'updateUserRole']);
    Route::put('/admin/users/{id}/block', [AdminController::class, 'blockUser']);
    Route::get('/admin/statisticsOverview', [AdminController::class, 'statisticsOverview']);
    Route::get('/admin/stats/users-daily', [AdminController::class, 'getCountUserDay']);
    Route::get('/admin/stats/daily-counts', [AdminController::class, 'getCountPostDay']);
});
