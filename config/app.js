const config = {
  domainName: "",
};

if (process.env.NODE_ENV !== "development") {
  config.domainName = "https://fizi-chemi.vercel.app";
} else {
  config.domainName = "http://localhost:3000";
}

export default config;
