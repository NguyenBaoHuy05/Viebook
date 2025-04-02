# Sử dụng Node.js phiên bản 18
FROM node:18

# Thiết lập thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép package.json và package-lock.json (nếu có)
COPY ../frontend/package*.json ./

# Cài đặt các thư viện frontend
RUN npm install

# Sao chép toàn bộ mã nguồn frontend vào container
COPY ../frontend /usr/src/app

# Mở port 3000 cho Next.js
EXPOSE 3000

# Khởi động Next.js với chế độ development
CMD ["npm", "run", "dev"]
