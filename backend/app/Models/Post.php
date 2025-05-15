<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'type_content', 'title', 'content', 'share_post_id', 'privacy'];

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
