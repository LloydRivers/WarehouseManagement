// src/datasource/InMemoryCustomerDataSource.ts
import { ICustomerDataSource } from "../types/datasource";
import { Customer } from "../models/Customer/Customer";

export class InMemoryCustomerDataSource implements ICustomerDataSource {
  private customers: Customer[] = [
    new Customer("1", "Harry Potter", "harry.potter@hogwarts.edu", {
      street: "4 Privet Drive",
      city: "Little Whinging",
      postalCode: "SW20 9NE",
      country: "UK",
      phoneNumber: "000-0001",
    }),
    new Customer("2", "Frodo Baggins", "frodo.baggins@shire.com", {
      street: "Bag End",
      city: "Hobbiton",
      postalCode: "12345",
      country: "Middle-earth",
      phoneNumber: "000-0002",
    }),
  ];

  loadCustomers(): Customer[] {
    return this.customers;
  }
}
