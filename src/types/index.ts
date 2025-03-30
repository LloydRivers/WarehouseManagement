export interface IOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface IOrderHistory {
  orderId: string;
  orderDate: string;
  products: { productId: string; quantity: number; price: number }[];
}

export interface IAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}
export interface IShippingAddress extends IAddress {
  deliveryInstructions?: string;
}

export interface ISupplier {
  id: string;
  name: string;
  getContactPerson(): string;
  getEmail(): string;
  getPhoneNumber(): string;
  getAddress(): IAddress;
}
