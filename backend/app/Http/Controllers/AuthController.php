<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\RegisterRequest;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\ForgetRequest;
use Illuminate\Support\Facades\Password;
use App\Http\Requests\ResetPasswordRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;

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
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]
        ]);
    }

    public function login(LoginRequest $request)
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'Tài khoản hoặc mật khẩu không đúng.'], 401);
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
        $remember = $request->boolean('remember');

        $token = $user->createToken('auth_token', expiresAt: $remember ? now()->addDays(30) : now()->addSeconds(10))->plainTextToken;

        return response()->json(['token' => $token, 'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ]]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }
    public function forget(ForgetRequest $request)
    {
        try {
            $validated = $request->validated();
            Log::info('Forget password request', ['email' => $validated['email']]);
            $status = Password::sendResetLink(['email' => $validated['email']]);
            if ($status === Password::RESET_LINK_SENT) {
                return response()->json(['message' => 'Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.']);
            }
            return response()->json(['message' => __($status)], 400);
        } catch (\Exception $e) {
            Log::error('Forget password error', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Đã xảy ra lỗi, vui lòng thử lại sau.'], 500);
        }
    }
    public function reset(ResetPasswordRequest $request)
    {
        if (!URL::hasValidSignature($request)) {
            return response()->json(['message' => 'Liên kết không hợp lệ.'], 403);
        }
        $validated = $request->validated();

        $status = Password::reset(
            [
                'email' => $validated['email'],
                'password' => $validated['password'],
                'password_confirmation' => $validated['password_confirmation'],
                'token' => $validated['token'],
            ],
            function ($user, $password) {
                $user->password = bcrypt($password);
                $user->save();
                $user->tokens()->delete(); // Xóa token Sanctum
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Mật khẩu đã được đặt lại thành công.']);
        }

        return response()->json(['message' => __($status)], 400);
    }
}
