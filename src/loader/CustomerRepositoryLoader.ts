// src/loader/CustomerRepositoryLoader.ts
import { CustomerRepository } from "../repository/CustomerRepository";
import { ICustomerDataSource } from "../types/datasource";

export class CustomerRepositoryLoader {
  static load(dataSource: ICustomerDataSource): CustomerRepository {
    const initialCustomers = dataSource.loadCustomers();
    return new CustomerRepository(initialCustomers);
  }
}
