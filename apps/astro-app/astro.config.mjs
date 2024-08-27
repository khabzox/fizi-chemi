import config from "../../config/app"
import { defineConfig } from "astro/config";

// https://astro.build/config 
export default defineConfig({
  // Your Astro configuration
  site: config.domainName,
  base: "/",
  output: "static",
});
