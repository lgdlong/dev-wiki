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

# 1. Build & Push API
# -------------------
echo "Đang build API..."
docker build --platform linux/amd64 -t lgdlong/dev-wiki-api:latest -f apps/api/Dockerfile .
docker push lgdlong/dev-wiki-api:latest

# 2. Build & Push Web
# -------------------
echo "Đang build Web..."
docker build --platform linux/amd64 -t lgdlong/dev-wiki-web:latest -f apps/web/Dockerfile .
docker push lgdlong/dev-wiki-web:latest

# 3. Build & Push Postgres (Vì bạn có file Dockerfile.postgres riêng)
# -------------------
echo "Đang build Postgres..."
docker build --platform linux/amd64 -t lgdlong/dev-wiki-postgres:latest -f Dockerfile.postgres .
docker push lgdlong/dev-wiki-postgres:latest
