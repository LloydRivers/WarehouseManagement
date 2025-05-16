export interface IOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface CustomerOrder {
  customerId: string;
  id: string;
  orderDate: string;
  products: IOrderItem[];
}

export interface IAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}

export interface ISupplier {
  id: string;
  name: string;
  getContactPerson(): string;
  getEmail(): string;
  getPhoneNumber(): string;
  getAddress(): IAddress;
}
