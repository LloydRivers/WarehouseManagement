import { ICustomerDataSource } from "../types/datasource";
import { Customer } from "../models/Customer/Customer";
import { DomainError } from "../utils/Error";

export class CustomerRepository {
  private dataSource: ICustomerDataSource;
  private customers: Customer[];

  /**
   * Constructor using dependency injection pattern.
   */
  constructor(dataSource: ICustomerDataSource) {
    this.dataSource = dataSource;
    this.customers = this.dataSource.loadCustomers();
  }

  getById(customerId: string): Customer | undefined {
    return this.customers.find((customer) => customer.id === customerId);
  }

  save(customer: Customer): void {
    if (this.customers.some((existing) => existing.id === customer.id)) {
      throw new DomainError("Customer already exists");
    }
    this.customers.push(customer);
  }

  update(customer: Customer): void {
    const index = this.customers.findIndex(
      (existing) => existing.id === customer.id
    );
    if (index === -1) {
      throw new DomainError("Cannot update non-existent customer");
    }
    this.customers[index] = customer;
  }

  getAll(): Customer[] {
    return this.customers;
  }
}
