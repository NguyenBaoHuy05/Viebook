<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConversationUser extends Model
{
    protected $table = 'conservation_user';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }
}
