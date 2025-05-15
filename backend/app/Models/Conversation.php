<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Conversation extends Model
{
    use HasFactory;
    protected $fillable = [
        'type',
        'creator_id',
    ];
    public function users()
    {
        return $this->belongsToMany(User::class, 'conversation_user', 'conversation_id', 'user_id');
    }
    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function participants()
    {
        return $this->hasMany(ConversationUser::class);
    }
}
