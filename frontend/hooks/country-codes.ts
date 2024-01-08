export function useCountryCodes(): CountryCode[] {
  return [
    {
      name: "United States Dollar",
      code: "USD",
    },
    {
      name: "Euro",
      code: "EUR",
    },
    {
      name: "British Pound",
      code: "GBP",
    },
    {
      name: "Japanese Yen",
      code: "JPY",
    },
    {
      name: "Australian Dollar",
      code: "AUD",
    },
    {
      name: "Canadian Dollar",
      code: "CAD",
    },
    {
      name: "Swiss Franc",
      code: "CHF",
    },
    {
      name: "Chinese Yuan Renminbi",
      code: "CNY",
    },
    {
      name: "Russian Ruble",
      code: "RUB",
    },
    {
      name: "Indian Rupee",
      code: "INR",
    },
    {
      name: "Brazilian Real",
      code: "BRL",
    },
    {
      name: "Mexican Peso",
      code: "MXN",
    },
    {
      name: "South African Rand",
      code: "ZAR",
    },
    {
      name: "Nigerian Naira",
      code: "NGN",
    },
  ];
}
// declare type for useCountryCodes
export type CountryCode = {
  name: string;
  code: string;
};
