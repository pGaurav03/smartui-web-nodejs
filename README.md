# smartui-web-nodejs

Visual regression testing sample for a **web application** using
[LambdaTest SmartUI](https://www.lambdatest.com/smartui). Unlike LambdaTest's
`smartui-appium-nodejs` sample (native mobile apps via Appium), this project
targets a browser-based sample app.

It ships **two ways to run it**, because SmartUI supports two different
modes and they trade off differently:

| | Mode A — SDK/exec (Selenium) | Mode B — Capture (single JSON) |
|---|---|---|
| Command | `npm test` | `npm run capture` |
| Config | `config/capabilities.js` (code) | `.smartui.json` + `smartui-web.json` (JSON only) |
| Desktop browsers | Chrome, Edge, Firefox, WebKit — real LambdaTest cloud | Chrome, Edge, Firefox, WebKit — launched locally |
| Mobile | **Real devices**: Android (Galaxy S23/Tab S8), iOS (iPhone 14/iPad Air) | **Emulated viewports**: `"iPhone 14"`, `"Galaxy S24"` (Playwright device profiles, not real hardware) |
| Interaction | Yes — clicks, navigation, login flows, anything Selenium can do | No — just loads a list of URLs and screenshots them |
| Setup | LambdaTest account + Selenium grid | Nothing but a JSON file — runs headless browsers locally |

Use **Mode A** when you need real-device fidelity or the flow involves
clicking through the app. Use **Mode B** — the one JSON config combining web
+ mobile in one place — when you just want fast, broad coverage of a list of
pages with zero test code.

## How it works

**Mode A (SDK/exec):** each capability in `config/capabilities.js` is sent
to the LambdaTest Selenium grid (`hub.lambdatest.com`), which spins up the
requested browser/OS or real mobile device. The test navigates the sample
app and calls `smartuiSnapshot()` from `@lambdatest/selenium-driver` at key
screens (home page, a listing page).

**Mode B (capture):** `.smartui.json` declares `web.browsers` +
`web.viewports` and `mobile.devices` together in one config. `smartui-web.json`
lists the URLs to capture. Running `smartui capture` launches local headless
browsers (bundled via Playwright — Chromium, Firefox, WebKit) plus emulated
mobile viewports, and screenshots every URL × browser/device combination —
no Selenium code at all.

Either way, SmartUI collects the screenshots from every combination and
renders them side by side in the SmartUI dashboard, flagging visual diffs
against a baseline on subsequent runs.

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

Mode A — SDK/exec (real cloud browsers + real devices, interactive):

```bash
npm test               # Full matrix: all desktop browsers + real Android/iOS devices
npm run test:desktop   # Desktop browsers only (Chrome, Edge, Firefox, WebKit)
npm run test:mobile    # Mobile only (real Android + iOS devices)
```

Each run prints a LambdaTest job per capability; snapshots land in the
SmartUI project's build view once the run finishes, grouped so you can diff
the same screen across every browser/device/resolution at a glance.

Mode B — capture (one JSON config, web + mobile together, no cloud grid needed):

```bash
npm run capture
```

This reads `.smartui.json` for the browser/viewport/device matrix and
`smartui-web.json` for the list of pages, and screenshots every
page × browser/device combination in one command. `LT_USERNAME` /
`LT_ACCESS_KEY` / `PROJECT_TOKEN` are still required (only for
authenticating and uploading results to the SmartUI dashboard — the
browsers themselves run locally on your machine).

## Project layout

```
config/
  capabilities.js    # Mode A: the browser/OS/device/resolution matrix (code)
  buildDriver.js      # Mode A: builds a remote WebDriver session for one capability
test/
  smartui.test.js     # Mode A: Mocha spec — navigates the app, takes SmartUI snapshots
.smartui.json          # Mode B: web browsers + mobile devices + viewports (single JSON)
smartui-web.json       # Mode B: list of URLs to capture
.env.example
```

## Adjusting coverage

**Mode A (code-driven):**
- **Add a resolution**: duplicate a desktop entry in `capabilities.js` with a
  different `resolution` value.
- **Add a device**: duplicate a mobile entry with a different `deviceName` /
  `platformVersion` — see LambdaTest's [Real Device
  list](https://www.lambdatest.com/capabilities-generator/) for valid names.

**Mode B (JSON-driven):**
- **Add a resolution**: append a width to `web.viewports` in `.smartui.json`,
  e.g. `[1920], [1366], [1024], [768]`.
- **Add a mobile device**: append a name to `mobile.devices` in
  `.smartui.json` (must be a valid Playwright device profile, e.g.
  `"Pixel 7"`, `"iPhone 15 Pro Max"`). `browsers` accepts at most
  `chrome`, `firefox`, `safari` (= WebKit), `edge`.
- **Add/remove pages**: edit the array in `smartui-web.json`.

**Both modes:** point at a different app by changing `SAMPLE_URL` in `.env`
(Mode A) and the `url` fields in `smartui-web.json` (Mode B).
