import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';

@Entity({ name: 'product_categories' })
@Index(['productId', 'categoryId'], { unique: true })
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id', nullable: false })
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'category_id', nullable: false })
  categoryId: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
