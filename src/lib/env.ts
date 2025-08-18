const env = {
  DB_PORT: process.env.DB_PORT || "3306",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_NAME: process.env.DB_NAME || "ciscode_db",

  PORT: process.env.PORT || "3000",
  JWT_SECRET: process.env.JWT_SECRET || "default_secret_key",

  PROBLEM_LIMIT_PER_PAGE: 10,
  SUBMISSION_LIMIT_PER_PAGE: 10,
};

export default env;
