export function useCategories(): Categories[] {
  return [
    {
      key: "Housing",
      data: [
        "Rent/Mortgage",
        "Property taxes",
        "Home insurance",
        "Maintenance & repairs",
      ],
    },
    {
      key: "Utilities",
      data: [
        "Power bill",
        "Water bill",
        "Gas bill",
        "Internet bill",
        "Trash removal",
      ],
    },
    {
      key: "Food",
      data: ["Groceries", "Coffee & snacks", "Alcohol"],
    },
    {
      key: "Transportation",
      data: [
        "Public transportation",
        "Gas & car maintenance",
        "Parking",
        "Ridesharing",
      ],
    },
    {
      key: "Personal",
      data: [
        "Health insurance",
        "Phone bill",
        "Clothing",
        "Toiletries",
        "Haircuts",
      ],
    },
    {
      key: "Entertainment",
      data: [
        "Streaming services (Netflix, Hulu, HBO Max, etc.)",
        "Movies & concerts",
        "Sports & hobbies",
        "Dining out",
        "Travel",
      ],
    },
    {
      key: "Debt",
      data: ["Student loans", "Credit card payments", "Personal loans"],
    },
    {
      key: "Savings & Investments",
      data: ["Emergency fund", "Retirement savings", "Investing"],
    },
    {
      key: "Gifts & Donations",
      data: ["Birthday gifts", "Holiday gifts", "Charitable donations"],
    },
    {
      key: "Education",
      data: ["Tuition fees", "Books & supplies"],
    },
    {
      key: "Pets",
      data: ["Food & treats", "Vet care", "Grooming"],
    },
    {
      key: "Business",
      data: ["Office supplies", "Software subscriptions", "Travel expenses"],
    },
    {
      key: "Other",
      data: [
        "Subscriptions (box services, gym membership, etc.)",
        "Insurance (life, disability, etc.)",
        "Legal fees",
        "Taxes",
        "Other expenses",
      ],
    },
  ];
}

// declare type for useCategories
export type Categories = {
  key: string;
  data: string[];
};
