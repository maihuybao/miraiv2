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

## User

Bảng User của Database.

### Cách dùng
- User.getInfo(uid): Lấy thông tin user trên Facebook.
- User.getAll(data\*): Lấy tất cả giá trị của user có ở data trong database.
- User.getData(uid): Lấy thông tin user trong database.
- User.setData(uid, options\*\*): Đặt thông tin user trong database.
- User.delData(uid): Xóa user trong database.
- User.createData({ uid, default }): Tạo user trong database (default: giá trị được gán mặc định).

## Thread

Bảng Thread của Database.

### Cách dùng
- Thread.getInfo(tid): Lấy thông tin của nhóm chat trên Facebook.
- Thread.getAll(data\*): Lấy tất cả giá trị của nhóm chat có ở data trong database.
- Thread.getData(tid): Lấy thông tin nhóm chat trong database.
- Thread.setData(tid, options\*\*): Đặt thông tin nhóm chat trong database.
- Thread.delData(tid): Xóa nhóm chat trong database.
- Thread.createData({ tid, default }): Tạo nhóm chat trong database (default: giá trị được gán mặc định).

## Currencies

Bảng Currencies của Database.

### Cách dùng
- Currency.getAll(data\*): Lấy tất cả giá trị của currency có ở data trong database.
- Currency.getData(uid): Lấy thông tin currency trong database.
- Currency.setData(uid, options\*\*): Đặt thông tin currency trong database.
- Currency.delData(uid): Xóa currency trong database.
- Currency.createData({ uid, default }): Tạo currency trong database (default: giá trị được gán mặc định).

## Chú ý (\*)
- uid: ID của user.

- tid: ID của nhóm chat.

- data(\*): Là 1 Array hoặc Object chứa các giá trị để tìm kiếm dữ liệu trong database.
  + VD: User.getAll(['uid', 'name']) -> Đưa ra các dữ liệu chỉ chứa uid và name của tất cả user.

- options(\*\*): Là 1 Object chứa thông tin cần đặt.
  + VD: User.setData(uid, { name: 'SpermLord The Second' }) -> Đặt tên của user có ID là "uid" thành "SpermLord The Second" trong database.