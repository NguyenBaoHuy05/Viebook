<!DOCTYPE html>
<html>

<head>
    <title>Xác Minh Địa Chỉ Email</title>
</head>

<body>
    <h1>Xác Minh Địa Chỉ Email</h1>
    <p>Vui lòng nhấn vào nút dưới đây để xác minh địa chỉ email của bạn: {{ $email }}</p>
    <a href="{{ $url }}"
        style="display: inline-block; padding: 10px 20px; background-color: #3490dc; color: white; text-decoration: none; border-radius: 5px;">Xác
        Minh Email</a>
    <p>Link này sẽ hết hạn sau 60 phút.</p>
    <p>Nếu bạn không tạo tài khoản, vui lòng bỏ qua email này.</p>
    <p>Thanks,<br>{{ config('app.name') }}</p>
</body>

</html>