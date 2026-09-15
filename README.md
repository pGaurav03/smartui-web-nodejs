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
npm run baseline        # First run ever — marks this build as the baseline
npm test                # Every run after — compares against the baseline
npm run test:desktop    # Desktop browsers only (Chrome, Edge, Firefox, WebKit)
npm run test:mobile     # Mobile only (real Android + iOS devices)
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

## Baseline vs. comparison (how SmartUI diffing works)

SmartUI compares builds within a **project**, not within a single run:

1. **First run ever for the project** → SmartUI has nothing to diff against,
   so it automatically becomes the **baseline**. Run either:
   ```bash
   npm run baseline   # same as `npm test`, but explicitly marks this build baseline
   ```
2. **Every run after that** → run the normal command:
   ```bash
   npm test           # or `npm run capture`
   ```
   SmartUI automatically diffs the new screenshots against the baseline and
   shows a per-screen visual diff percentage in the dashboard. Nothing in
   the test code changes between a baseline run and a comparison run — only
   the `--markBaseline` flag differs.
3. **UI intentionally changed and the diff is expected?** Re-run
   `npm run baseline` to reset the baseline to the current state, or approve
   the new baseline from inside the SmartUI dashboard's build view.

## Push to GitHub + daily automated runs

This repo includes `.github/workflows/smartui-daily.yml`, a GitHub Actions
workflow that runs the full Mode A matrix (Chrome/Edge/Firefox/WebKit + real
Android/iOS) every day at **09:00 IST (03:30 UTC)**, and can also be
triggered manually from the Actions tab (with an option to mark that run as
the new baseline instead of comparing).

**One-time setup after pushing:**

1. In the GitHub repo → **Settings → Secrets and variables → Actions →
   Secrets**, add:
   - `LT_USERNAME`
   - `LT_ACCESS_KEY`
   - `PROJECT_TOKEN`
2. (Optional) Under **Variables**, add `SAMPLE_URL` if you want to point at
   an app other than the default.
3. Trigger the **first** run manually from the Actions tab
   (`workflow_dispatch`, tick "Mark this run's snapshots as the new
   baseline") so the very first CI build becomes the baseline. After that,
   the daily cron runs in comparison mode automatically.

To change the schedule, edit the `cron` line in
`.github/workflows/smartui-daily.yml` (cron is always UTC).

## Project layout

```
.github/workflows/
  smartui-daily.yml    # Daily cron (+ manual trigger) running the full matrix in CI
config/
  capabilities.js      # Mode A: the browser/OS/device/resolution matrix (code)
  buildDriver.js       # Mode A: builds a remote WebDriver session for one capability
test/
  smartui.test.js      # Mode A: Mocha spec — navigates the app, takes SmartUI snapshots
.smartui.json           # Mode B: web browsers + mobile devices + viewports (single JSON)
smartui-web.json        # Mode B: list of URLs to capture
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
