<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Log;

class CustomResetPassword extends Notification
{
    use Queueable;
    public $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $url = config('app.frontend_url') . '/reset-password?token=' . urlencode($this->token) . '&email=' . urlencode($notifiable->email);

        $mail = (new MailMessage)
            ->view('emails.reset-password', ['url' => $url, 'email' => $notifiable->email])
            ->subject('Đặt Lại Mật Khẩu');

        Log::info('Password reset email prepared for: ' . $notifiable->email, ['url' => $url]);

        return $mail;
    }
}
