# Install package
```
npm install
```

# Run application
```
npm start
```

# Admin page
## Điều khiển trạng thái trận đấu
Url: http://localhost:3000/admin
* Tạo danh sách đội chơi, ghép cặp sau các vòng đấu
* Điều khiển trận đấu: Bắt đầu, Restart, Hiển thị kết quả, Màn hình tính điểm realtime

## Config trạng thái cảm biến, edit kết quả
Url: http://localhost:3000/setting
1. Lấy kết quả từ sensor hoặc mobile
    * Trạng thái on: Lấy kết quả từ sensor.
    * Trạng thái off: Lấy kết quả từ mobile.
    * Button "Sân đỏ", "Sân xanh": để on/off tất cả sân tương ứng.
    * Cần "Cập nhật thay đổi" mỗi khi có chỉnh sửa

2. Thay đổi kết quả đội chơi
    * Thay đổi trực tiếp kết quả sau mỗi vòng.
    * Cần "Cập nhật thay đổi" mỗi khi có chỉnh sửa
