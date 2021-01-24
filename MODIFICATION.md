<p align="center">
	<a href="#Overview">Overview</a>
  -
  <a href="#Command-Modification">Command Modification</a>
	-
	<a href="#Database-Modification">Database Modification</a>
	-
	<a href="#Database-Controller">Database Controller</a>
</p>

# Overview

- Hướng dẫn Thêm/Xóa/Sửa lệnh của bot.
- Hướng dẫn Thêm/Xóa cột trong Database.
- Hướng dẫn cách tương tác với Database.

[ ! ] <b>Mọi thay đổi của bạn sẽ không được hỗ trợ nếu có lỗi xảy ra</b> [ ! ]

# Command Modification

## Thêm lệnh

- Viết 1 lệnh với template example.js trong modules/commands/
- Thêm các tương tác với Database nếu muốn thay đổi giá trị trong Database (Xem Database Controller để biết thêm).

## Xóa lệnh

- Xóa file [tên lệnh].js trong modules/commands/

## Sửa lệnh

- Mở file [tên lệnh].js trong modules/commands/ cần sửa.
- Sửa ¯\\\_(ツ)\_/¯.

# Database Modification

## Chuẩn bị

- Bật CMD/Terminal trong folder chứa bot.
- Nhập ```npx sequelize migration:generate --name [Tên tùy ý]``` (VD: ... --name createTestColumnInUsers).
- Mở file ...-[Tên vừa đặt].js trong includes/database/migrations để chuẩn bị code.

## Thêm cột

- Trong function up, bạn hãy chèn dòng này vào sau \*/:
```js
await queryInterface.addColumn([tên bảng], [tên cột], Sequelize.[kiểu dữ liệu]);
//Ví dụ: await queryInterface.addColumn('Users', 'isDead', Sequelize.BOOLEAN);
```
- Lưu file.
- Mở file [tên bảng].js trong includes/database/models.
- Chèn dòng: "[Tên cột]: DataTypes.[kiểu dữ liệu]," vào cuối đối số thứ nhất của [Tên bảng].init().
  + Ví dụ:
```js
Users.init({
  userID: DataTypes.BIGINT,
  name: DataTypes.STRING,
  banned: DataTypes.BOOLEAN,
  time2unban: DataTypes.STRING,
  reasonban: DataTypes.STRING,
  isDead: DataTypes.BOOLEAN, //<-- Đây là dòng đã được chèn dựa trên VD trước đó.
},
{
  sequelize,
  modelName: 'Users',
});
```
- Chạy và dùng bot bình thường.

## Xóa cột

- Trong function up, bạn hãy chèn dòng này vào sau \*/:
```js
await queryInterface.removeColumn([tên bảng], [tên cột]);
//Ví dụ: await queryInterface.removeColumn('Users', 'isDead');
```
- Lưu file.
- Mở file [tên bảng].js trong includes/database/models.
- Xóa dòng: "[Tên cột]: DataTypes..." của [Tên bảng].init().
  + Ví dụ:
```js
Users.init({
  userID: DataTypes.BIGINT,
  name: DataTypes.STRING,
  banned: DataTypes.BOOLEAN,
  time2unban: DataTypes.STRING,
  reasonban: DataTypes.STRING, //<-- Đã xóa dòng "isDead..." dựa trên VD Thêm cột.
},
{
  sequelize,
  modelName: 'Users',
});
```
- Chạy và dùng bot bình thường.

## Chú ý

- Phải tắt bot trước khi thực hiện bất kì thay đổi nào liên quan tới Database.
- Hiện tại chưa có cách dùng function down trực tiếp từ code (lười nghĩ) nên cần phải dùng bằng cmd (cách làm trên Google (lười nghĩ p2)).

# Database Controller

## Users

Bảng Users của Database.

### Cách dùng
- Users.getInfo(uid): Lấy thông tin user trên Facebook.
- Users.getAll(data\*): Lấy tất cả giá trị của user có ở data trong database.
- Users.getData(uid): Lấy thông tin user trong database.
- Users.setData(uid, options\*\*): Đặt thông tin user trong database.
- Users.delData(uid): Xóa user trong database.
- Users.createData(uid, default): Tạo user trong database (default: giá trị được gán mặc định).

## Threads

Bảng Threads của Database.

### Cách dùng
- Threads.getInfo(tid): Lấy thông tin của nhóm chat trên Facebook.
- Threads.getAll(data\*): Lấy tất cả giá trị của nhóm chat có ở data trong database.
- Threads.getData(tid): Lấy thông tin nhóm chat trong database.
- Threads.setData(tid, options\*\*): Đặt thông tin nhóm chat trong database.
- Threads.delData(tid): Xóa nhóm chat trong database.
- Threads.createData(tid, default): Tạo nhóm chat trong database (default: giá trị được gán mặc định).

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
  + VD (Lấy ra các dữ liệu chỉ chứa uid và name của tất cả user): 
  ```js
  Users.getAll(['uid', 'name'])
  ```

- options(\*\*): Là 1 Object chứa thông tin cần đặt.
  + VD (Đặt tên của user có ID là "uid" thành "SpermLord The Second" trong database):
  ```js
  Users.setData(uid, { name: 'SpermLord The Second' })
  ```