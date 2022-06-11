type Variables = "CLIENT_URL" | "JWT_SECRET" | "SESSION_SECRET" | "PORT";

const fetchVariable = (variable: Variables, prod: boolean): string => {
  if (!process.env[variable]) {
    throw new Error(
      `${variable} is not defined in .env.${
        prod ? "production" : "development"
      }`
    );
  }

  return process.env[variable];
};

export const env = (variable: Variables): string => {
  const prod = process.env.NODE_ENV === "production";
  return fetchVariable(variable, prod);
};

export const preflightENV = (): void => {
  const prod = process.env.NODE_ENV === "production";
  const variables: Variables[] = [
    "CLIENT_URL",
    "JWT_SECRET",
    "SESSION_SECRET",
    "PORT",
  ];

  variables.forEach((variable) => {
    fetchVariable(variable, prod);
  });

  return;
};
