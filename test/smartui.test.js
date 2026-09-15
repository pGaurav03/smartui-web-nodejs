require("dotenv").config();
const { By, until } = require("selenium-webdriver");
const { smartuiSnapshot } = require("@lambdatest/selenium-driver");
const { buildDriver } = require("../config/buildDriver");
const { DESKTOP, MOBILE, ALL } = require("../config/capabilities");

const SAMPLE_URL =
  process.env.SAMPLE_URL || "https://ecommerce-playground.lambdatest.io/";

const suite =
  process.env.SUITE === "desktop"
    ? DESKTOP
    : process.env.SUITE === "mobile"
    ? MOBILE
    : ALL;

describe("SmartUI visual regression — sample web app", function () {
  this.timeout(180000);

  suite.forEach((capability) => {
    it(`captures snapshots on ${capability.testName}`, async function () {
      const driver = await buildDriver(capability);

      try {
        // Home / landing page
        await driver.get(SAMPLE_URL);
        await driver.wait(until.elementLocated(By.tagName("body")), 30000);
        await smartuiSnapshot(driver, `Home - ${capability.testName}`);

        // Drill into a product listing page to capture a second, content-heavy view
        const categoryLink = await driver.findElements(
          By.css("a[href*='camera'], a[href*='laptop'], nav a")
        );
        if (categoryLink.length > 0) {
          await categoryLink[0].click();
          await driver.wait(until.elementLocated(By.tagName("body")), 30000);
          await smartuiSnapshot(driver, `Listing - ${capability.testName}`);
        }
      } finally {
        await driver.quit();
      }
    });
  });
});
