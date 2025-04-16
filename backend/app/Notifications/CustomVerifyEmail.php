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

        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $notifiable->getKey(), 'hash' => sha1($notifiable->getEmailForVerification())]
        );

        $frontendUrl = config('app.frontend_url') . '/verify-email?url=' . urlencode($url);

        $mail = (new MailMessage)
            ->view('emails.verify', ['url' => $frontendUrl, 'email' => $notifiable->email])
            ->subject('Xác Minh Địa Chỉ Email');

        Log::info('Verification email prepared for: ' . $notifiable->email);

        return $mail;
    }
}
