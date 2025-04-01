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

  save(customer: Customer): void {
    const customers = this.dataSource.loadCustomers();
    if (customers.some((existing) => existing.id === customer.id)) {
      throw new DomainError("Customer already exists");
    }
  }

  update(customer: Customer): void {
    const customers = this.dataSource.loadCustomers();
    const existingCustomer = customers.find(
      (existing) => existing.id === customer.id
    );
    if (!existingCustomer) {
      throw new DomainError("Cannot update non-existent customer");
    }
  }
}
