// Utility functions for generating mock data

let nextId = 1000;

export const generateId = () => nextId++;

// Generate Indian PAN number
export const generatePAN = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  
  let pan = '';
  for (let i = 0; i < 5; i++) {
    pan += letters[Math.floor(Math.random() * letters.length)];
  }
  for (let i = 0; i < 4; i++) {
    pan += digits[Math.floor(Math.random() * digits.length)];
  }
  pan += letters[Math.floor(Math.random() * letters.length)];
  
  return pan;
};

// Generate Indian GSTIN
export const generateGSTIN = () => {
  const stateCode = Math.floor(Math.random() * 35) + 1;
  const pan = generatePAN();
  const entityNumber = Math.floor(Math.random() * 10);
  const checkChar = 'Z';
  const checkDigit = Math.floor(Math.random() * 10);
  
  return `${stateCode.toString().padStart(2, '0')}${pan}${entityNumber}${checkChar}${checkDigit}`;
};

// Generate Indian TAN
export const generateTAN = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  
  let tan = '';
  for (let i = 0; i < 4; i++) {
    tan += letters[Math.floor(Math.random() * letters.length)];
  }
  for (let i = 0; i < 5; i++) {
    tan += digits[Math.floor(Math.random() * digits.length)];
  }
  tan += letters[Math.floor(Math.random() * letters.length)];
  
  return tan;
};

// Generate IFSC code
export const generateIFSC = () => {
  const banks = ['HDFC', 'ICIC', 'SBIN', 'AXIS', 'KOTK', 'IDBI', 'CITI', 'BARB'];
  const bank = banks[Math.floor(Math.random() * banks.length)];
  const branchCode = Math.floor(Math.random() * 1000000).toString().padStart(7, '0');
  
  return `${bank}0${branchCode}`;
};

// Generate bank account number
export const generateBankAccount = () => {
  return Math.floor(Math.random() * 9000000000000) + 1000000000000;
};

// Generate Indian phone number
export const generatePhoneNumber = () => {
  const prefixes = ['98', '97', '96', '95', '94', '93', '92', '91', '90', '89', '88', '87', '86', '85', '84', '83', '82', '81', '80', '79', '78', '77', '76', '75', '74', '73', '72', '71', '70'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  
  return `+91${prefix}${number}`;
};

// Generate email
export const generateEmail = (name: string, domain?: string) => {
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '.');
  const domains = ['gmail.com', 'outlook.com', 'company.com', 'business.in'];
  const selectedDomain = domain || domains[Math.floor(Math.random() * domains.length)];
  
  return `${cleanName}@${selectedDomain}`;
};

// Generate Indian company names
export const generateCompanyName = () => {
  const prefixes = ['Apex', 'Prime', 'Global', 'United', 'Royal', 'Elite', 'Premier', 'Dynamic', 'Strategic', 'Innovative'];
  const industries = ['Technologies', 'Solutions', 'Enterprises', 'Industries', 'Services', 'Consultancy', 'Systems', 'Innovations', 'Ventures', 'Holdings'];
  const suffixes = ['Pvt Ltd', 'Limited', 'LLP', 'and Associates'];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const industry = industries[Math.floor(Math.random() * industries.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  return `${prefix} ${industry} ${suffix}`;
};

// Generate person names
export const generatePersonName = () => {
  const firstNames = ['Rahul', 'Priya', 'Amit', 'Anjali', 'Vikram', 'Neha', 'Arjun', 'Kavita', 'Rohit', 'Sneha', 'Aditya', 'Pooja', 'Karthik', 'Divya', 'Suresh'];
  const lastNames = ['Sharma', 'Verma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Reddy', 'Iyer', 'Menon', 'Nair', 'Desai', 'Joshi', 'Kulkarni', 'Mehta', 'Shah'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
};

// Generate random date between two dates
export const generateDateBetween = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate past date
export const generatePastDate = (daysAgo: number = 365) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date;
};

// Generate future date
export const generateFutureDate = (daysAhead: number = 365) => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead));
  return date;
};

// Generate random amount
export const generateAmount = (min: number = 10000, max: number = 1000000) => {
  return Math.floor(Math.random() * (max - min) + min);
};

// Generate percentage
export const generatePercentage = (min: number = 0, max: number = 100) => {
  return Math.floor(Math.random() * (max - min) + min);
};

// Select random item from array
export const selectRandom = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

// Select multiple random items
export const selectMultipleRandom = <T>(items: T[], count: number): T[] => {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Delay utility for simulating API latency
export const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));