# Sử dụng PHP và PHP-FPM
FROM php:8.2-fpm

# Cài đặt các thư viện yêu cầu cho Laravel
RUN apt-get update && apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev zip git && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install gd pdo pdo_mysql

# Cài đặt Composer (quản lý thư viện PHP)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Thiết lập thư mục làm việc
WORKDIR /var/www

# Sao chép mã nguồn Laravel từ thư mục backend vào container
COPY ../backend /var/www

# Cài đặt các dependencies của Laravel
RUN composer install

# Cấp quyền cho thư mục storage và cache
RUN chmod -R 777 /var/www/storage /var/www/bootstrap/cache

# Mở port 8000 cho Laravel
EXPOSE 8000

# Khởi động Laravel
CMD ["php-fpm"]
