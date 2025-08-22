import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../entities/product.entity';

export function toEntity(dto: CreateProductDto, creatorId: number): Product {
  const product = new Product();
  product.name = dto.name;
  product.description = dto.description ? dto.description : '';
  product.logoUrl = dto.logoUrl ? dto.logoUrl : '';
  product.homepageUrl = dto.homepageUrl ? dto.homepageUrl : '';
  product.githubUrl = dto.githubUrl ? dto.githubUrl : '';
  product.pros = dto.pros ? dto.pros : '';
  product.cons = dto.cons ? dto.cons : '';
  product.createdBy = creatorId;
  return product;
}
