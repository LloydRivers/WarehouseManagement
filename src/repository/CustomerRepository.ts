// src/repository/CustomerRepository.ts
import { ICustomerDataSource } from "../types/datasource";
import { Customer } from "../models/Customer/Customer";
import { DomainError } from "../utils/Error";

export class CustomerRepository {
  private dataSource: ICustomerDataSource;

  constructor(dataSource: ICustomerDataSource) {
    this.dataSource = dataSource;
    console.log("CustomerRepository initialized with data source:", dataSource);
  }

  getById(customerId: string): Customer | undefined {
    const customers = this.dataSource.loadCustomers();
    return customers.find((customer) => customer.id === customerId);
  }

  // You can add save and update logic here, depending on the data source's functionality
  save(customer: Customer): void {
    const customers = this.dataSource.loadCustomers();
    if (customers.some((existing) => existing.id === customer.id)) {
      throw new DomainError("Customer already exists");
    }
    // Logic to save the customer (this could vary depending on the data source)
  }

  update(customer: Customer): void {
    const customers = this.dataSource.loadCustomers();
    const existingCustomer = customers.find(
      (existing) => existing.id === customer.id
    );
    if (!existingCustomer) {
      throw new DomainError("Cannot update non-existent customer");
    }
    // Logic to update the customer
  }
}
