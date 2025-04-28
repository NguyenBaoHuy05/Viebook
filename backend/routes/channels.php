<?php

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('chat.{conversationId}', function ($user, $conversationId) {
    Log::info('User ID fxfuwecu: ' . $user->id);
    return $user->conversation()->where('id', $conversationId)->exists();
});
