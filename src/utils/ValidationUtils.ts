export class ValidationUtils {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^[\d\s\+\-()]{8,20}$/;
    return phoneRegex.test(phoneNumber);
  }
}
