// src/datasource/InMemoryCustomerDataSource.ts
import { ICustomerDataSource } from "../types/datasource";
import { Customer } from "../models/Customer/Customer";

/*
 * This in-memory data source simulates persistent storage for customers.
 * allowing easy testing and separation of concerns without external dependencies.
 * In a real application, this would be replaced with a database or an API.
 */
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
