const puppeteer = require("puppeteer");
const fs = require("fs");
const utils = require("./utils");
const config = require("./config");
screenSize = config.screenSize;
folder = `images/${utils.getDate()}_prtg`;

screenSize.height = 1000;
// screenSize.width = 1280;

if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder);
}

async function start(url) {
  const puppeteerDefaultOptions = {
    headless: false,
    args: [
      `--window-size=${screenSize.width},${screenSize.height}`,
      // `--host-rules=MAP cms2.kehakiman.gov.my ${ip}`,
    ],
    ignoreHTTPSErrors: true,
  };
  const browser = await puppeteer.launch(puppeteerDefaultOptions);
  const page = await browser.newPage();

  await page.setViewport(screenSize);

  const response = await page.goto(url);
  // await page.waitForTimeout(2000);
  // await page.waitForSelector(".close");
  // await page.$eval(".close", (el) => el.click());

  await page.type("#loginusername", "eCourtsdeveloper");
  await page.type("#loginpassword", "Password1234");

  await page.waitForTimeout(2000);
  await page.click(".loginbutton");
  await page.waitForTimeout(2000);

  await page.goto("https://10.19.14.160/maps.htm");
  await page.screenshot({
    path: `${folder}/list_prtg.png`,
    fullPage: false,
  });
  await page.goto("https://10.19.14.160/map.htm?id=4507&tabid=1");
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: `${folder}/efs_prtg.png`,
    fullPage: true,
  });
  await page.goto("https://10.19.14.160/map.htm?id=4506&tabid=1");
  await page.waitForTimeout(2000);
  var elementHandle = await page.$(".header");
  await elementHandle.evaluate((el) => (el.style.display = "none"));
  var elementHandle = await page.$(".header-spacer");
  await elementHandle.evaluate((el) => (el.style.display = "none"));
  var elementHandle = await page.$(".headerBreadcrumbs");
  await elementHandle.evaluate((el) => (el.style.display = "none"));
  var elementHandle = await page.$(".sitecaption");
  await elementHandle.evaluate((el) => (el.style.display = "none"));
  var elementHandle = await page.$(".nav-tabs");
  await elementHandle.evaluate((el) => (el.style.display = "none"));
  await page.waitForTimeout(30000);

  await page.screenshot({
    path: `${folder}/cms_prtg.png`,
    fullPage: true,
  });
  await browser.close();
}

async function main() {
  await start("https://10.19.14.160/index.htm?logout=1");
}

main();
