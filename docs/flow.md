# Tổng hợp chức năng và luồng hoạt động của Viebook

## 1. Đăng ký, đăng nhập, xác thực người dùng

### Đăng ký tài khoản
- **Frontend**
  - File: `frontend/app/(auth)/signup/page.tsx`
  - Hàm: `SignupPage`, `handleSubmit`
  - Khi người dùng điền form và submit, hàm `handleSubmit` gọi API `/api/register` (POST) qua axios.
- **Backend**
  - File: `backend/app/Http/Controllers/AuthController.php`
  - Hàm: `register`
  - Nhận dữ liệu từ frontend, validate qua `RegisterRequest`, tạo user mới trong bảng `users`, gửi email xác thực.
- **Database**
  - Bảng: `users` (migrations: `backend/database/migrations/0001_01_01_000000_create_users_table.php`)
  - Trường: `username`, `name`, `email`, `password`, `email_verified_at`, ...
- **Luồng hoạt động**
  1. Người dùng nhập thông tin và nhấn đăng ký.
  2. Frontend gửi POST `/api/register` với dữ liệu.
  3. Backend validate, tạo user, gửi email xác thực.
  4. User phải xác minh email mới đăng nhập được.

### Đăng nhập
- **Frontend**
  - File: `frontend/app/(auth)/login/page.tsx`
  - Hàm: `LoginPage`, `handleSubmit`
  - Gửi POST `/api/login` với email, password.
- **Backend**
  - File: `backend/app/Http/Controllers/AuthController.php`
  - Hàm: `login`
  - Kiểm tra thông tin, xác minh email, trả về token đăng nhập (cookie).
- **Database**
  - Bảng: `users`, token lưu qua Laravel Sanctum.
- **Luồng hoạt động**
  1. Người dùng nhập email, password, nhấn đăng nhập.
  2. Frontend gửi POST `/api/login`.
  3. Backend xác thực, trả về token, lưu cookie đăng nhập.

### Xác thực email
- **Frontend**
  - File: `frontend/app/(auth)/verify-email/page.tsx`
  - Hàm: `VerifyEmailPage`
  - Khi người dùng click link xác thực trong email, frontend gửi POST `/api/verify-email`.
- **Backend**
  - File: `backend/app/Http/Controllers/AuthController.php`
  - Hàm: `verifyEmail`
  - Kiểm tra token, xác thực email cho user.
- **Database**
  - Trường `email_verified_at` trong bảng `users` được cập nhật.

## 2. Quản lý tài khoản cá nhân

- **Frontend**
  - File: `frontend/components/Sidebar.tsx`
  - Hàm: cập nhật thông tin gọi API trong các hàm như `handleSubmit`, `handleImageChange`
  - Giao diện chỉnh sửa thông tin, ảnh đại diện, tiểu sử, vị trí, đổi mật khẩu.
- **Backend**
  - File: `backend/app/Http/Controllers/AccountController.php`
  - Hàm: `update`
  - API: `PUT /api/account/{username}` (xác thực Sanctum)
  - Kiểm tra quyền, cập nhật trường `name`, `bio`, `location`, `profile_picture` cho user.
- **Database**
  - Bảng: `users`
  - Trường: `name`, `bio`, `location`, `profile_picture`, ...
- **Luồng hoạt động**
  1. Người dùng chỉnh sửa thông tin trên giao diện.
  2. Frontend gửi PUT `/api/account/{username}`.
  3. Backend xác thực, cập nhật thông tin user trong database.

## 3. Kết bạn, theo dõi, quản lý bạn bè

- **Frontend**
  - File: `frontend/components/Sidebar.tsx`, `frontend/components/Account/friend.tsx`
  - Hàm: `handleFriend`, `handleRemoveFriend`, `handleUnFollow`, v.v.
  - Gửi các API: `/api/friends/add`, `/api/friends/{friend_id}` (DELETE), `/api/friends/acceptFriend` (PUT), `/api/friends/pendingList` (GET), `/api/friends/friendList` (GET)
- **Backend**
  - File: `backend/app/Http/Controllers/FriendController.php`
  - Các hàm: `addFriend`, `deleteFriend`, `acceptFriend`, `getPendingFriendList`, `getFriendsList`
  - Xử lý logic gửi/kết bạn, chấp nhận, xóa, lấy danh sách bạn bè, cập nhật bảng `friends`, gửi thông báo.
- **Database**
  - Bảng: `friends`
  - Trường: `user_id`, `friend_id`, `status` (pending, accepted, blocked, deleted), ...
- **Luồng hoạt động**
  1. Người dùng gửi lời mời kết bạn, chấp nhận, hủy, xem danh sách bạn bè.
  2. Frontend gọi các API tương ứng.
  3. Backend cập nhật bảng `friends`, gửi thông báo, cập nhật số lượng bạn bè.

## 4. Đăng bài viết, chia sẻ, tương tác

- **Frontend**
  - File: `frontend/components/CreateAPost.tsx`, `frontend/components/CreatePost.tsx`, `frontend/components/PostFeed.tsx`, `frontend/components/Post.tsx`
  - Hàm: Gửi bài viết mới (`axios.post('/api/posts')`), like (`axios.post('/api/posts/{id}/react')`), share, xóa bài viết, v.v.
- **Backend**
  - File: `backend/app/Http/Controllers/PostController.php`
  - Hàm: `createPost`, `toggleReact`, `destroy`, `index`
  - API: `/api/posts` (POST, GET), `/api/posts/{id}/react` (POST), `/api/posts/{id}` (DELETE)
  - Xử lý tạo bài viết, cập nhật bảng `posts`, tăng số lượng like/share/comment.
- **Database**
  - Bảng: `posts`, `post_reacts`
  - Trường: `user_id`, `title`, `content`, `react_count`, `comment_count`, `share_count`, ...
- **Luồng hoạt động**
  1. Người dùng đăng bài, like, share, xóa bài.
  2. Frontend gọi các API tương ứng.
  3. Backend cập nhật bảng `posts`, `post_reacts`, trả về dữ liệu mới.

## 5. Bình luận, trả lời bình luận

- **Frontend**
  - File: `frontend/components/CommentFeed.tsx`, `frontend/components/CommentSection.tsx`
  - Hàm: Gửi bình luận (`axios.post('/api/posts/{id}/comment')`), lấy bình luận (`axios.get('/api/posts/{id}/comments')`)
- **Backend**
  - File: `backend/app/Http/Controllers/CommentController.php`
  - Hàm: `createComment`, `index`
  - API: `/api/posts/{id}/comment` (POST), `/api/posts/{id}/comments` (GET)
  - Xử lý tạo bình luận, trả về danh sách bình luận, hỗ trợ bình luận lồng nhau.
- **Database**
  - Bảng: `comments`
  - Trường: `user_id`, `post_id`, `content`, `parent_comment_id`, `top_level_comment_id`, ...
- **Luồng hoạt động**
  1. Người dùng gửi bình luận hoặc trả lời bình luận.
  2. Frontend gọi API, backend lưu vào bảng `comments`, trả về danh sách mới.

## 6. Hệ thống thông báo

- **Frontend**
  - File: `frontend/components/PopoverNotifycation.tsx`
  - Hàm: gọi API lấy thông báo (`axios.get('/api/notification/getAllNotification')`), cập nhật trạng thái đọc (`axios.post('/api/notification/changeRedDot')`)
- **Backend**
  - File: `backend/app/Http/Controllers/NotificationController.php`
  - Hàm: `getAllNotification`, `changeIsRead`
  - API: `/api/notification/getAllNotification` (GET), `/api/notification/changeRedDot` (POST)
  - Xử lý lấy danh sách thông báo, cập nhật trạng thái đã đọc.
- **Database**
  - Bảng: `notifications`
  - Trường: `user_id`, `actor_id`, `type`, `target_id`, `is_read`, ...
- **Luồng hoạt động**
  1. Khi có tương tác (like, comment, kết bạn, tin nhắn...), backend tạo bản ghi mới trong bảng `notifications`.
  2. Frontend gọi API lấy thông báo, cập nhật trạng thái đã đọc.

## 7. Nhắn tin, trò chuyện riêng tư

- **Frontend**
  - File: `frontend/components/Chat.tsx`, `frontend/components/PopoverChat.tsx`
  - Hàm: gửi tin nhắn (`axios.post('/api/{userId}/send')`), lấy tin nhắn (`axios.get('/api/{conversationId}/messages')`)
- **Backend**
  - File: `backend/app/Http/Controllers/MessageController.php`
  - Hàm: `sendMessage`, `getMessages`, `getOrCreateConversation`, `destroy`
  - API: `/api/{userId}/send` (POST), `/api/{conversationId}/messages` (GET), `/api/messages/{id}/{check}` (DELETE), `/api/conversation` (POST)
  - Xử lý gửi, lấy, xóa, khôi phục tin nhắn, tạo cuộc trò chuyện mới.
- **Database**
  - Bảng: `messages`, `conversations`, `conversation_user`
  - Trường: `user_id`, `conversation_id`, `content`, `is_deleted`, ...
- **Luồng hoạt động**
  1. Người dùng gửi/nhận tin nhắn, tạo cuộc trò chuyện.
  2. Frontend gọi API, backend lưu tin nhắn, trả về lịch sử chat.

## 8. Quản trị viên (Admin)

- **Frontend**
  - File: `frontend/app/(protected)/(admin)/admin/list/users/page.tsx`, `frontend/app/(protected)/(admin)/admin/list/posts/page.tsx`
  - Hàm: gọi API lấy danh sách user (`axios.get('/api/admin/users')`), block user (`axios.put('/api/admin/users/block')`), lấy/xóa bài viết (`axios.get`, `axios.delete`)
- **Backend**
  - File: `backend/app/Http/Controllers/AdminController.php`
  - Hàm: `getAllUsers`, `blockUser`, `getAllPosts`, ...
  - API: `/api/admin/users` (GET), `/api/admin/users/block` (PUT), `/api/admin/posts` (GET), `/api/admin/posts/{id}` (DELETE)
  - Xử lý quản lý user, bài viết, thống kê hệ thống.
- **Database**
  - Bảng: `users`, `posts`, ...
- **Luồng hoạt động**
  1. Admin xem danh sách user, block user, xem/xóa bài viết, xem thống kê hệ thống.
  2. Frontend gọi API, backend cập nhật dữ liệu tương ứng.
