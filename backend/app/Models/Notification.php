<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = ['actor_id', 'user_id', 'type', 'target_id', 'isRead'];

    public function actor()
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
