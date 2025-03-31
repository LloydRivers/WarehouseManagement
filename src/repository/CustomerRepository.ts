// src/repository/CustomerRepository.ts
import { Customer } from "../models/Customer/Customer";
import { DomainError } from "../utils/Error";

export class CustomerRepository {
  private customers: Map<string, Customer>;

  constructor(initialCustomers: Customer[] = []) {
    this.customers = new Map<string, Customer>(
      initialCustomers.map((customer) => [customer.id, customer])
    );
  }

  getById(customerId: string): Customer | undefined {
    return this.customers.get(customerId);
  }

  save(customer: Customer): void {
    if (this.customers.has(customer.id)) {
      throw new DomainError("Customer already exists");
    }
    this.customers.set(customer.id, customer);
  }

  update(customer: Customer): void {
    if (!this.customers.has(customer.id)) {
      throw new DomainError("Cannot update non-existent customer");
    }
    this.customers.set(customer.id, customer);
  }
}
