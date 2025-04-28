// src/repository/ProductRepository.ts
import { products } from "../mockData";
import { Product } from "../models/inventory/Product";
import { DomainError } from "../utils/Error";

export class InventoryRepository {
  private products: Product[] = products;
}
