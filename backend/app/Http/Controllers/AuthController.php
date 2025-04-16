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
use Illuminate\Support\Facades\URL;
use App\Http\Requests\VerifyEmailRequest;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\ResendVerificationRequest;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        try {
            $validated = $request->validated();

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => bcrypt($validated['password']),
            ]);

            event(new Registered($user));

            return response()->json([
                'message' => 'Đăng ký thành công. Vui lòng kiểm tra email để xác minh tài khoản.',
            ], 201);
        } catch (\Exception $e) {
            Log::error('Register error', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'], 500);
        }
    }
    public function verifyEmail(VerifyEmailRequest $request)
    {
        try {
            $validated = $request->validated();
            $user = User::find($validated['id']);

            if (!$user) {
                return response()->json(['message' => 'Người dùng không tồn tại.'], 404);
            }
            if ($user->hasVerifiedEmail()) {
                return response()->json(['message' => 'Email đã được xác minh trước đó.'], 200);
            }

            if (sha1($user->email) !== $validated['hash']) {
                return response()->json(['message' => 'Liên kết xác minh không hợp lệ.'], 422);
            }

            $user->markEmailAsVerified();
            event(new Verified($user));

            return response()->json(['message' => 'Email đã được xác minh thành công.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã có lỗi xảy ra. Vui lòng thử lại sau!'], 500);
        }
    }
    public function resendVerification(ResendVerificationRequest $request)
    {
        try {
            $validated = $request->validated();
            Log::info('Resend verification request', ['email' => $validated['email']]);

            $user = User::where('email', $validated['email'])->first();
            if (!$user) {
                return response()->json(['message' => 'Email không tồn tại.'], 422);
            }

            if ($user->hasVerifiedEmail()) {
                return response()->json(['message' => 'Email đã được xác minh.'], 422);
            }

            $user->sendEmailVerificationNotification();
            return response()->json(['message' => 'Email xác minh đã được gửi lại.'], 200);
        } catch (\Exception $e) {
            Log::error('Resend verification error', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'], 500);
        }
    }
    public function login(LoginRequest $request)
    {
        try {
            $validated = $request->validated();
            Log::info('Login request', ['email' => $validated['email']]);

            if (!Auth::attempt(['email' => $validated['email'], 'password' => $validated['password']])) {
                return response()->json(['message' => 'Thông tin đăng nhập không chính xác.'], 401);
            }

            //Comment bên dưới để ide hiểu rõ Auth ở đây là instance của user
            /** @var \App\Models\User $user */
            $user = Auth::user();
            if (!$user->hasVerifiedEmail()) {
                return response()->json(['message' => 'Vui lòng xác minh email trước khi đăng nhập.'], 403);
            }

            $token = $user->createToken('auth_token')->plainTextToken;
            return response()->json([
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
            ], 200);
        } catch (\Exception $e) {
            Log::error('Login error', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'], 500);
        }
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
        try {

            $validated = $request->validated();
            Log::info('Password reset attempt', [
                'email' => $validated['email'],
                'token' => $validated['token'],
            ]);

            $status = Password::reset(
                [
                    'email' => $validated['email'],
                    'password' => $validated['password'],
                    'token' => $validated['token'],
                ],
                function ($user, $password) {
                    $user->forceFill([
                        'password' => Hash::make($password),
                    ])->save();
                    $user->tokens()->delete(); // Xóa token Sanctum
                }
            );

            if ($status === Password::PASSWORD_RESET) {
                return response()->json(['message' => 'Mật khẩu đã được đặt lại thành công.'], 200);
            }

            Log::warning('Password reset failed', ['status' => $status]);
            return response()->json(['message' => __($status)], 422);
        } catch (\Exception $e) {
            Log::error('Password reset error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['message' => 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'], 500);
        }
    }
}
