# Stage 1: Build
FROM golang:1.25.5-alpine AS build

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build binary
RUN go build -ldflags="-s -w" -o main cmd/api/main.go

# Stage 2: Production
FROM alpine:3.22 AS prod

WORKDIR /app

# Cài chứng chỉ SSL (cần thiết để gọi Google API/Youtube API)
RUN apk add --no-cache ca-certificates tzdata

# Copy file binary từ bước build
COPY --from=build /app/main /app/main

# EXPOSE chỉ mang tính chất thông báo port
EXPOSE 8080

# Chạy ứng dụng. Lúc này nó sẽ đọc biến môi trường từ Docker Compose
CMD ["./main"]
