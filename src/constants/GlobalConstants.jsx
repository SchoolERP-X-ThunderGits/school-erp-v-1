export const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const below20 = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
export const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
export const thousands = ["", "Thousand", "Million", "Billion", "Trillion"];


const currentYear = new Date().getFullYear();
const sessions = [
  `${currentYear}-${currentYear + 1}`,
  `${currentYear + 1}-${currentYear + 2}`,
  `${currentYear + 2}-${currentYear + 3}`,
];

// Export sessions directly
export const sessionsArray = sessions;
export const sectionArray = ['A', 'B', 'C', 'D', 'E', 'F'];
export const GenderArray = ['Male', 'Female', 'Other'];
export const ReligionArray = ['Hinduism', 'Islam', 'Christianity','Sikhism','Buddhism','Other'];
export const CategoryArray = ['General', 'OBC', 'ST','Sc','Other'];
export const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
export const Plans = ['Free','Basic','Premium']