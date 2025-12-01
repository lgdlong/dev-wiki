// apps/api/src/modules/tutorials/dto/tutorials.dto.ts
// DTO: Data Transfer Object
// Dùng để định nghĩa cấu trúc dữ liệu khi truyền giữa các lớp, các tầng trong ứng dụng
// Giúp tách biệt giữa mô hình dữ liệu và cách dữ liệu được truyền đi
// Giúp kiểm soát dữ liệu đầu vào và đầu ra, đảm bảo tính nhất quán và an toàn

// TutorialListItemDto: Dùng để hiển thị danh sách bài viết
// TutorialDetailDto: Dùng để hiển thị chi tiết một bài viết cụ thể
// import { Tag } from '../../tags/entities/tag.entity';
//
// export class TutorialListItemDto {
//   id!: number;
//   title!: string;
//   createdAt!: Date;
//   updatedAt!: Date;
//   authorName!: string;
// }
//
// export class TutorialDetailDto extends TutorialListItemDto {
//   authorAvatarUrl!: string;
//   content!: string; //(!) non-null assertion
//   slug: string;
//   views: number;
//   isPublished: boolean;
//   tags: Tag[]; // <-- Add tags field
// }
// khi quản lý không cần hiển thị content nếu không tốn bộ nhớ
// khi mod click vào bài cụ thể -> hiển thị content -> tiết kiệm hơn

// using contructor to easily create instances from partial data
import { Tag } from '../../tags/entities/tag.entity';

export class TutorialListItemDto {
  id!: number;
  title!: string;
  slug!: string;
  createdAt!: Date;
  updatedAt!: Date;
  authorName!: string;
  authorAvatarUrl!: string;

  constructor(partial: Partial<TutorialListItemDto>) {
    Object.assign(this, partial);
  }
}

export class TutorialDetailDto extends TutorialListItemDto {
  content!: string;
  views!: number;
  isPublished!: boolean;
  tags!: Tag[];

  constructor(partial: Partial<TutorialDetailDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
