<x-mail::message>
    {{-- Greeting --}}
    # Chào bạn!

    {{-- Intro Lines --}}
    Cảm ơn bạn đã đăng ký. Vui lòng nhấn nút bên dưới để xác minh địa chỉ email.

    {{-- Action Button --}}
    <x-mail::button :url="$url">
        Xác minh Email
    </x-mail::button>

    {{-- Outro Lines --}}
    Nếu bạn không tạo tài khoản, vui lòng bỏ qua email này.

    {{-- Salutation --}}
    Trân trọng,<br>
    {{ config('app.name') }}
</x-mail::message>