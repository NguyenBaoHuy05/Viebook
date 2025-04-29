# Viebook

Cách chạy realtime-chat:
Chạy php artisan reverb:start --debug để chạy server vererb

Luồng chạy realtime: tin nhắn -> call api -> gọi broadcast để chuyển đến MessageSent event -> frontend nghe sự kiện và hiển thị tin nhắn

Có dùng context để lấy userID ở thư mục context/UserContext
