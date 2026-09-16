require("dotenv").config();
const { By, until } = require("selenium-webdriver");
const { smartuiSnapshot } = require("@lambdatest/selenium-driver");
const { buildDriver } = require("../config/buildDriver");
const { DESKTOP, MOBILE, ALL } = require("../config/capabilities");

const SAMPLE_URL =
  process.env.SAMPLE_URL || "https://ecommerce-playground.lambdatest.io/";

// Navigated to directly (rather than clicking a nav link) so the flow
// doesn't depend on a menu item being visible/clickable in every
// browser/viewport/device combination.
const LISTING_URL =
  process.env.LISTING_URL ||
  "https://ecommerce-playground.lambdatest.io/index.php?route=product/category&path=33_57";

const suite =
  process.env.SUITE === "desktop"
    ? DESKTOP
    : process.env.SUITE === "mobile"
    ? MOBILE
    : ALL;

describe("SmartUI visual regression — sample web app", function () {
  // Real-device allocation on LambdaTest's cloud can occasionally take a
  // while (device queueing); keep headroom above the default so a slow
  // allocation doesn't fail the whole suite.
  this.timeout(300000);

  suite.forEach((capability) => {
    it(`captures snapshots on ${capability.testName}`, async function () {
      const driver = await buildDriver(capability);

      try {
        // Home / landing page
        await driver.get(SAMPLE_URL);
        await driver.wait(until.elementLocated(By.tagName("body")), 30000);
        await smartuiSnapshot(driver, `Home - ${capability.testName}`);

        // Product listing page — a second, content-heavy view
        await driver.get(LISTING_URL);
        await driver.wait(until.elementLocated(By.tagName("body")), 30000);
        await smartuiSnapshot(driver, `Listing - ${capability.testName}`);
      } finally {
        await driver.quit();
      }
    });
  });
});
