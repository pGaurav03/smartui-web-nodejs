const { Builder } = require("selenium-webdriver");

const HUB_URL = "https://hub.lambdatest.com/wd/hub";

/**
 * Builds a remote WebDriver session on the LambdaTest grid for a given
 * capability entry from config/capabilities.js.
 */
async function buildDriver(capability) {
  const { LT_USERNAME, LT_ACCESS_KEY } = process.env;
  if (!LT_USERNAME || !LT_ACCESS_KEY) {
    throw new Error(
      "LT_USERNAME / LT_ACCESS_KEY are not set. Copy .env.example to .env and fill in your LambdaTest credentials."
    );
  }

  const capabilities = {
    ...capability,
    "LT:Options": {
      ...capability["LT:Options"],
      user: LT_USERNAME,
      accessKey: LT_ACCESS_KEY,
      w3c: true,
    },
  };

  return new Builder()
    .usingServer(HUB_URL)
    .withCapabilities(capabilities)
    .build();
}

module.exports = { buildDriver };
