<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\RegisterRequest;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
        ]);

        try {
            Log::info('Triggering Registered event for user: ' . $user->email);
            event(new Registered($user));
            Log::info('Registered event triggered for user: ' . $user->email);
        } catch (\Exception $e) {
            Log::error('Failed to trigger Registered event: ' . $e->getMessage());
            throw $e; // Ném lỗi để debug
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'token' => $token,
            'user' => $user,
            'message' => 'Registration successful. Please check your email to verify your account.',
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Kiểm tra xem email đã được xác minh chưa
        if (!$user->hasVerifiedEmail()) {
            // Tùy chọn: Gửi lại email xác minh
            $user->sendEmailVerificationNotification();

            return response()->json([
                'message' => 'Email not verified. Please verify your email to login.',
                'email' => $user->email,
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }


}
