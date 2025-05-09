// src/repository/CustomerRepository.ts
import { ICustomerDataSource } from "../types/datasource";
import { Customer } from "../models/Customer/Customer";
import { DomainError } from "../utils/Error";

export class CustomerRepository {
  private dataSource: ICustomerDataSource;
  /**
   * Constructor using dependency injection pattern.
   */
  constructor(dataSource: ICustomerDataSource) {
    this.dataSource = dataSource;
  }

  private loadCustomers(): Customer[] {
    return this.dataSource.loadCustomers();
  }

  getById(customerId: string): Customer | undefined {
    const customers = this.loadCustomers();
    return customers.find((customer) => customer.id === customerId);
  }

  save(customer: Customer): void {
    const customers = this.loadCustomers();
    if (customers.some((existing) => existing.id === customer.id)) {
      throw new DomainError("Customer already exists");
    }
  }

  update(customer: Customer): void {
    const customers = this.loadCustomers();
    const existingCustomer = customers.find(
      (existing) => existing.id === customer.id
    );
    if (!existingCustomer) {
      throw new DomainError("Cannot update non-existent customer");
    }
  }
}
