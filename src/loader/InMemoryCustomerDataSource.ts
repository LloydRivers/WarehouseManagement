// src/loader/InMemoryCustomerDataSource.ts
import { Customer } from "../models/Customer/Customer";
import { ICustomerDataSource } from "../types/datasource";

export class InMemoryCustomerDataSource implements ICustomerDataSource {
  loadCustomers(): Customer[] {
    return [
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
      new Customer("3", "Sherlock Holmes", "sherlock.holmes@bakerstreet.com", {
        street: "221B Baker Street",
        city: "London",
        postalCode: "SW1A 2AA",
        country: "England",
        phoneNumber: "000-0003",
      }),
      new Customer("4", "Katniss Everdeen", "katniss.everdeen@district12.com", {
        street: "12 Victory Lane",
        city: "District 12",
        postalCode: "40123",
        country: "Panem",
        phoneNumber: "000-0004",
      }),
      new Customer("5", "Luke Skywalker", "luke.skywalker@rebelalliance.org", {
        street: "Tatooine Desert",
        city: "Tatooine",
        postalCode: "00002",
        country: "Galaxy Far, Far Away",
        phoneNumber: "000-0005",
      }),
    ];
  }
}
