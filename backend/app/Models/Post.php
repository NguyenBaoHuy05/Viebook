<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = ['user_id', 'type_content', 'title', 'content'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reacts()
    {
        return $this->hasMany(PostReact::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
