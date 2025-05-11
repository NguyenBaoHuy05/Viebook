<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'post_id',
        'parent_comment_id',
        'top_level_comment_id', 
        'content'
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function post()
    {
        return $this->belongsTo(Post::class);
    }
    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_comment_id');
    }
    public function replies()
    {
        return $this->hasMany(Comment::class, 'top_level_comment_id');
    }
    public function topLevelComment()
    {
        return $this->belongsTo(Comment::class, 'top_level_comment_id');
    }
    
}
