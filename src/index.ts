// index.ts
import { ConcreteMix } from "./models/inventory/ConcreteMix";
import { Supplier } from "./models/Supplier/Supplier";
import { Customer } from "./models/Customer/Customer";
import { InMemoryCustomerDataSource } from "./loader/InMemoryCustomerDataSource";
import { CustomerRepository } from "./repository/CustomerRepository";

const dataSource = new InMemoryCustomerDataSource();
const repository = new CustomerRepository(dataSource);
console.log("In-memory customer repository loaded:", repository);
