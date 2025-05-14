<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\CustomResetPassword;
use App\Notifications\CustomVerifyEmail;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Friend;
class User extends Authenticatable implements MustVerifyEmail
{
    use Notifiable, HasApiTokens, SoftDeletes;

    protected $fillable = [
        'username',
        'name',
        'email',
        'password',
        'role',
        'profile_picture',
        'bio',
        'location',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
    public function sendEmailVerificationNotification()
    {
        $this->notify(new CustomVerifyEmail());
    }
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new CustomResetPassword($token));
    }
    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function conversations()
    {
        return $this->belongsToMany(Conversation::class, 'conversation_user');
    }
    public function postsReact()
    {
        return $this->hasMany(PostReact::class);
    }
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    public function sentFriendRequests()
    {
        return $this->hasMany(Friend::class, 'requester_id');
    }

    public function receivedFriendRequests()
    {
        return $this->hasMany(Friend::class, 'addressee_id');
    }

    public function allFriendIds()
    {
        $friends1 = Friend::where('user_id', $this->id)
            ->where('status', 'accepted')
            ->pluck('friend_id');
        $friends2 = Friend::where('friend_id', $this->id)
            ->where('status', 'accepted')
            ->pluck('user_id');
        
        return $friends1->merge($friends2)->unique()->values();
    }
}
