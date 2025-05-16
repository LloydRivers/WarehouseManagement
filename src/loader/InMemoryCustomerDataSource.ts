// src/datasource/InMemoryCustomerDataSource.ts
import { ICustomerDataSource } from "../types/datasource";
import { Customer } from "../models/Customer/Customer";

export class InMemoryCustomerDataSource implements ICustomerDataSource {
  private customers: Customer[] = [
    new Customer(
      "1",
      "Harry Potter",
      "123 Main St",
      "harry.potter@hogwarts.edu"
    ),
  ];

  loadCustomers(): Customer[] {
    return this.customers;
  }
}
