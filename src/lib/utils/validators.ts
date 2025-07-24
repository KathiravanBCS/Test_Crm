// PAN validation - Format: AAAAA9999A
export function validatePAN(pan: string): boolean {
  if (!pan) return false;
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.toUpperCase());
}

// GSTIN validation - Format: 22AAAAA0000A1Z5
export function validateGSTIN(gstin: string): boolean {
  if (!gstin) return false;
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin.toUpperCase());
}

// TAN validation - Format: AAAA99999A
export function validateTAN(tan: string): boolean {
  if (!tan) return false;
  const tanRegex = /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/;
  return tanRegex.test(tan.toUpperCase());
}

// Email validation
export function validateEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation (Indian mobile)
export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  const phoneRegex = /^[6-9]\d{9}$/;
  // Remove common prefixes and spaces
  const cleanPhone = phone.replace(/^\+91|^91|^0|\s/g, '');
  return phoneRegex.test(cleanPhone);
}

// IFSC validation - Format: AAAA0999999
export function validateIFSC(ifsc: string): boolean {
  if (!ifsc) return false;
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifsc.toUpperCase());
}

// Bank account validation (basic)
export function validateBankAccount(account: string): boolean {
  if (!account) return false;
  // Basic validation - between 9 and 18 digits
  const accountRegex = /^\d{9,18}$/;
  return accountRegex.test(account);
}

// Pincode validation (Indian)
export function validatePincode(pincode: string): boolean {
  if (!pincode) return false;
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
}