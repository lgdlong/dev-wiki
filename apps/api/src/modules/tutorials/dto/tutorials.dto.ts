export class TutorialListItemDto {
  id!: number;
  title!: string;
  createdAt!: Date;
  updatedAt!: Date;
  authorName!: string;
}

export class TutorialDetailDto extends TutorialListItemDto {
  content!: string; //(!) non-null assertion
}

// khi quản lý không cần hiển thị content nếu không tốn bộ nhớ
// khi mod click vào bài cụ thể -> hiển thị content -> tiết kiệm hơn
