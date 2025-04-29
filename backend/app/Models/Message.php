<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $table = 'messages';
    protected $fillable = ['id', 'user_id', 'conversation_id', 'content', 'is_deleted', 'created_at', 'updated_at'];

    public function sender()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function receiver()
    {
        return $this->belongsTo(Conversation::class, 'conversation_id');
    }
}
