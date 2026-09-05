
export const CURRENCIES = [
  {
    code: "INR",
    label: "Indian Rupee (₹)",
    symbol: "₹"
  },
  {
    code: "USD",
    label: "US Dollar ($)",
    symbol: "$"
  },
  {
    code: "EUR",
    label: "Euro (€)",
    symbol: "€"
  },
  {
    code: "GBP",
    label: "British Pound (£)",
    symbol: "£"
  },
  {
    code: "AED",
    label: "UAE Dirham (د.إ)",
    symbol: "د.إ"
  },
];

export const getCurrencySymbol = (code) => {
   for(const currency of CURRENCIES){
    if(currency.code == code){
      return currency.symbol;
    }
   }

   return "";
}