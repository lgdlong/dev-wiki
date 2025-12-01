### Tổng kết quy trình làm việc mới (Workflow)

Từ giờ trở đi, mỗi khi bạn code xong tính năng mới và muốn update lên VPS:

1.  **Tại máy Local:**
    * Sửa code.
    * Chạy lệnh `docker build ...` và `docker push ...` (như ở Giai đoạn 1).
2.  **Tại VPS:**
    * Gõ đúng 2 lệnh:
        ```bash
        docker compose pull
        docker compose up -d
        ```
    * Xong! Chờ vài giây để Docker tự động tải image mới và khởi động lại container với phiên bản mới nhất.
