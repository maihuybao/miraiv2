<p align="center">
	<a href="Overview">Tổng Quan</a>
	-
	<a href="#Database Controller">Database Controller</a>
</p>

# Overview

Hướng dẫn Thêm/Xóa/Sửa lệnh của bot.
<b>Mọi thay đổi/chỉnh sửa của bạn sẽ không được hỗ trợ nếu có lỗi xảy ra.</b>

## Thêm lệnh

- Viết 1 lệnh với template example.js trong modules/commands/
- Thêm các tương tác với Database/Table nếu muốn thay đổi giá trị trong Database (Xem Database Controller để biết thêm).

## Xóa lệnh

- Xóa file [tên lệnh].js trong modules/commands/

## Sửa lệnh

- Mở file [tên lệnh].js trong modules/commands/ cần sửa.
- Sửa ¯\\\_(ツ)\_/¯.

# Database Controller

## Users

Bảng Users của Database.

### Cách dùng
- Users.getInfo(uid): Lấy thông tin user trên Facebook.
- Users.getAll(data\*): Lấy tất cả giá trị của user có ở data trong database.
- Users.getData(uid): Lấy thông tin user trong database.
- Users.setData(uid, options\*\*): Đặt thông tin user trong database.
- Users.delData(uid): Xóa user trong database.
- Users.createData({ uid, default }): Tạo user trong database (default: giá trị được gán mặc định).

## Threads

Bảng Threads của Database.

### Cách dùng
- Threads.getInfo(tid): Lấy thông tin của nhóm chat trên Facebook.
- Threads.getAll(data\*): Lấy tất cả giá trị của nhóm chat có ở data trong database.
- Threads.getData(tid): Lấy thông tin nhóm chat trong database.
- Threads.setData(tid, options\*\*): Đặt thông tin nhóm chat trong database.
- Threads.delData(tid): Xóa nhóm chat trong database.
- Threads.createData({ tid, default }): Tạo nhóm chat trong database (default: giá trị được gán mặc định).

## Currencies

Bảng Currencies của Database.

### Cách dùng
- Currencies.getAll(data\*): Lấy tất cả giá trị của currency có ở data trong database.
- Currencies.getData(uid): Lấy thông tin currency trong database.
- Currencies.setData(uid, options\*\*): Đặt thông tin currency trong database.
- Currencies.delData(uid): Xóa currency trong database.
- Currencies.createData(uid, default): Tạo currency trong database (default: giá trị được gán mặc định).
- Currencies.increaseMoney(uid, money): Thêm tiền cho uid.
- Currencies.decreaseMoney(uid, money): Giảm tiền cho uid.

## Chú ý (\*)
- uid: ID của user.

- tid: ID của nhóm chat.

- data(\*): Là 1 Array hoặc Object chứa các giá trị để tìm kiếm dữ liệu trong database.
  + VD: Users.getAll(['uid', 'name']) -> Đưa ra các dữ liệu chỉ chứa uid và name của tất cả user.

- options(\*\*): Là 1 Object chứa thông tin cần đặt.
  + VD: Users.setData(uid, { name: 'SpermLord The Second' }) -> Đặt tên của user có ID là "uid" thành "SpermLord The Second" trong database.