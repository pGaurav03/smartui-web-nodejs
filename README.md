# smartui-web-nodejs

Visual regression testing sample for a **web application** using
[LambdaTest SmartUI](https://www.lambdatest.com/smartui) driven by Selenium
WebDriver. Unlike LambdaTest's `smartui-appium-nodejs` sample (native mobile
apps via Appium), this project targets a browser-based sample app and runs
the same test across:

| Target  | How it's covered |
|---|---|
| Chrome  | Desktop, Windows 11, 1920x1080 & 1366x768 |
| Edge    | Desktop, Windows 11, 1920x1080 |
| Firefox | Desktop, Windows 11, 1920x1080 |
| WebKit (Safari) | Desktop, macOS Sonoma, 1920x1080 |
| Android | Real devices — Galaxy S23 (phone) & Galaxy Tab S8 (tablet), Chrome |
| iOS     | Real devices — iPhone 14 (phone) & iPad Air (tablet), Safari |

The browser/device/resolution matrix lives entirely in
[`config/capabilities.js`](config/capabilities.js) — add or remove entries
there and every test run picks it up automatically, no test code changes
needed.

## How it works

1. Each capability in the matrix is sent to the LambdaTest Selenium grid
   (`hub.lambdatest.com`), which spins up the requested browser/OS or real
   mobile device.
2. The test navigates to the sample web app and calls `smartuiSnapshot()`
   from `@lambdatest/selenium-driver` at key screens (home page, a listing
   page).
3. SmartUI collects the DOM/screenshot from every combination and renders
   them side by side in the SmartUI dashboard, flagging visual diffs against
   a baseline on subsequent runs.

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:

```
LT_USERNAME=your_lambdatest_username
LT_ACCESS_KEY=your_lambdatest_access_key
PROJECT_TOKEN=your_smartui_project_token   # from the SmartUI project's Config tab
SAMPLE_URL=https://ecommerce-playground.lambdatest.io/
```

- `LT_USERNAME` / `LT_ACCESS_KEY`: LambdaTest account credentials
  (Account Settings → Password & Security).
- `PROJECT_TOKEN`: create a **Web** project in the SmartUI dashboard first;
  the SDK reads this env var to know which project to push snapshots to.

## Run

```bash
# Full matrix: all desktop browsers + real Android/iOS devices
npm test

# Desktop browsers only (Chrome, Edge, Firefox, WebKit)
npm run test:desktop

# Mobile only (real Android + iOS devices)
npm run test:mobile
```

Each run prints a LambdaTest job per capability; snapshots land in the
SmartUI project's build view once the run finishes, grouped so you can diff
the same screen across every browser/device/resolution at a glance.

## Project layout

```
config/
  capabilities.js   # the browser/OS/device/resolution matrix
  buildDriver.js     # builds a remote WebDriver session for one capability
test/
  smartui.test.js    # Mocha spec: navigates the app, takes SmartUI snapshots
.smartui.json         # SmartUI SDK config (render wait times, viewport hints)
.env.example
```

## Adjusting coverage

- **Add a resolution**: duplicate a desktop entry in `capabilities.js` with a
  different `resolution` value.
- **Add a device**: duplicate a mobile entry with a different `deviceName` /
  `platformVersion` — see LambdaTest's [Real Device
  list](https://www.lambdatest.com/capabilities-generator/) for valid names.
- **Point at a different app**: change `SAMPLE_URL` in `.env`.
