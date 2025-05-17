export class Address {
  constructor(
    private readonly _street: string,
    private readonly _city: string,
    private readonly _country: string,
    private _postalCode?: string
  ) {}

  getStreet(): string {
    return this._street;
  }

  getCity(): string {
    return this._city;
  }

  getCountry(): string {
    return this._country;
  }

  getPostalCode(): string | undefined {
    return this._postalCode;
  }

  setPostalCode(code: string | undefined) {
    this._postalCode = code;
  }

  getFullAddress(): string {
    return this._postalCode
      ? `${this._street}, ${this._city}, ${this._country}, ${this._postalCode}`
      : `${this._street}, ${this._city}, ${this._country}`;
  }
}
