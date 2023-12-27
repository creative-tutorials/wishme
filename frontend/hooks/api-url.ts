export const getAPIURL = () => {
  if (process.env.NODE_ENV === "development") return "http://localhost:8080";
  else return "https://api-wishme.vercel.app";
};
