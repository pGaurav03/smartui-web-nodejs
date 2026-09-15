/**
 * Cross-browser / cross-device / multi-resolution matrix.
 * Each entry is a W3C desired-capabilities object sent to the
 * LambdaTest Selenium hub. Add or remove entries here to change coverage —
 * nothing else in the test needs to change.
 *
 * `browserName` is required on every entry (including mobile) — the
 * selenium-webdriver Builder throws locally ("did you forget to call
 * forBrowser()?") if it's missing, before it ever reaches LambdaTest.
 */

const DESKTOP = [
  {
    testName: "Chrome-1920x1080",
    browserName: "Chrome",
    browserVersion: "latest",
    "LT:Options": {
      platform: "Windows 11",
      resolution: "1920x1080",
      build: "SmartUI Web Sample",
      project: "smartui-web-nodejs",
      visual: true,
    },
  },
  {
    testName: "Chrome-1366x768",
    browserName: "Chrome",
    browserVersion: "latest",
    "LT:Options": {
      platform: "Windows 11",
      resolution: "1366x768",
      build: "SmartUI Web Sample",
      project: "smartui-web-nodejs",
      visual: true,
    },
  },
  {
    testName: "Edge-1920x1080",
    browserName: "MicrosoftEdge",
    browserVersion: "latest",
    "LT:Options": {
      platform: "Windows 11",
      resolution: "1920x1080",
      build: "SmartUI Web Sample",
      project: "smartui-web-nodejs",
      visual: true,
    },
  },
  {
    testName: "Firefox-1920x1080",
    browserName: "Firefox",
    browserVersion: "latest",
    "LT:Options": {
      platform: "Windows 11",
      resolution: "1920x1080",
      build: "SmartUI Web Sample",
      project: "smartui-web-nodejs",
      visual: true,
    },
  },
  {
    // Safari is WebKit — this is the desktop WebKit target in the matrix.
    testName: "Safari-WebKit-1920x1080",
    browserName: "Safari",
    browserVersion: "latest",
    "LT:Options": {
      platform: "macOS Sonoma",
      resolution: "1920x1080",
      build: "SmartUI Web Sample",
      project: "smartui-web-nodejs",
      visual: true,
    },
  },
];

const MOBILE = [
  {
    // Real Android device — mobile Chrome
    testName: "Android-GalaxyS23-Chrome",
    browserName: "Chrome",
    "LT:Options": {
      platformName: "Android",
      deviceName: "Galaxy S23",
      platformVersion: "13",
      isRealMobile: true,
      build: "SmartUI Web Sample",
      project: "smartui-web-nodejs",
      visual: true,
    },
  },
  {
    // Real Android tablet — checks a distinct resolution/form factor
    testName: "Android-GalaxyTabS8-Chrome",
    browserName: "Chrome",
    "LT:Options": {
      platformName: "Android",
      deviceName: "Galaxy Tab S8",
      platformVersion: "12",
      isRealMobile: true,
      build: "SmartUI Web Sample",
      project: "smartui-web-nodejs",
      visual: true,
    },
  },
  {
    // Real iOS device — mobile Safari
    testName: "iOS-iPhone14-Safari",
    browserName: "Safari",
    "LT:Options": {
      platformName: "iOS",
      deviceName: "iPhone 14",
      platformVersion: "16",
      isRealMobile: true,
      build: "SmartUI Web Sample",
      project: "smartui-web-nodejs",
      visual: true,
    },
  },
  {
    // Real iPad — checks a distinct resolution/form factor.
    // No platformVersion pinned: this device/OS combo isn't guaranteed to
    // exist in LambdaTest's real-device pool, so let it pick whatever OS
    // version it has available for this device.
    testName: "iOS-iPadAir-Safari",
    browserName: "Safari",
    "LT:Options": {
      platformName: "iOS",
      deviceName: "iPad Air 2022",
      isRealMobile: true,
      build: "SmartUI Web Sample",
      project: "smartui-web-nodejs",
      visual: true,
    },
  },
];

module.exports = { DESKTOP, MOBILE, ALL: [...DESKTOP, ...MOBILE] };
