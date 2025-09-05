// apps/api/src/modules/tutorials/dto/tutorials.dto.ts
// DTO: Data Transfer Object
// Dùng để định nghĩa cấu trúc dữ liệu khi truyền giữa các lớp, các tầng trong ứng dụng
// Giúp tách biệt giữa mô hình dữ liệu và cách dữ liệu được truyền đi
// Giúp kiểm soát dữ liệu đầu vào và đầu ra, đảm bảo tính nhất quán và an toàn

// TutorialListItemDto: Dùng để hiển thị danh sách bài viết
// TutorialDetailDto: Dùng để hiển thị chi tiết một bài viết cụ thể
export class TutorialListItemDto {
  id!: number;
  title!: string;
  createdAt!: Date;
  updatedAt!: Date;
  authorName!: string;
}

export class TutorialDetailDto extends TutorialListItemDto {
  content!: string; //(!) non-null assertion
  slug: string;
  views: number;
  isPublished: boolean;
}

// khi quản lý không cần hiển thị content nếu không tốn bộ nhớ
// khi mod click vào bài cụ thể -> hiển thị content -> tiết kiệm hơn
