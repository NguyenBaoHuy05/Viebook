<?php

// app/Http/Middleware/AcceptTokenFromCookie.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AcceptTokenFromCookie
{
    public function handle(Request $request, Closure $next)
    {
        Log::info('Cookies: ', $request->cookies->all());
        $token = $request->cookie('auth_token');
        Log::info('auth_token cookie: ' . $token);

        if ($token && !$request->hasHeader('Authorization')) {
            $request->headers->set('Authorization', 'Bearer ' . $token);
            Log::info('Authorization header set from cookie.');
        }

        return $next($request);
    }
}
