import { Tag } from '../entities/tag.entity';

export interface TagSearchParams {
  q?: string;
  limit?: number; // default 10, max 50
  cursor?: string | null; // keyset theo name (name cuối trang trước)
  minChars?: number; // default 2: tối thiểu ký tự để bắt đầu search
}

export interface TagSearchResult {
  items: Pick<Tag, 'id' | 'name'>[];
  nextCursor: string | null;
}
