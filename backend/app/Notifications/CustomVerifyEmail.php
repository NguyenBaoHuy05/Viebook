<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Log;

class CustomVerifyEmail extends Notification
{
    use Queueable;

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        Log::info('Preparing to send verification email to: ' . $notifiable->email);

        $expiration = Carbon::now()->addMinutes(60);
        $url = $this->verificationUrl($notifiable, $expiration);

        // Sử dụng view tùy chỉnh thay vì template mặc định
        $mail = (new MailMessage)
            ->view('emails.verify', ['url' => $url, 'email' => $notifiable->email])
            ->subject('Xác Minh Địa Chỉ Email');

        Log::info('Verification email prepared for: ' . $notifiable->email);

        return $mail;
    }

    protected function verificationUrl($notifiable, $expiration)
    {
        return URL::temporarySignedRoute(
            'verification.verify',
            $expiration,
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );
    }
}