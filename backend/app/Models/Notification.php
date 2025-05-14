<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;
    protected $fillable = ['actor_id', 'user_id', 'type', 'target_type', 'target_id', 'is_read'];

    public function target()
    {
        return $this->morphTo();
    }

    public function actor()
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    public function recipient()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
