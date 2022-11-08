const puppeteer = require("puppeteer")
const fs = require("fs")
const utils = require("./utils")
const config = require("./config")
screenSize = config.screenSize
folder = `images/${utils.getDate()}_cms`

if (!fs.existsSync(folder)){
  fs.mkdirSync(folder)
}

async function start(url,ip){
    const puppeteerDefaultOptions = {
      headless: false,
      args: [
          `--window-size=${screenSize.width},${screenSize.height}`,
          `--host-rules=MAP cms2.kehakiman.gov.my ${ip}`
      ],
      ignoreHTTPSErrors: true
    };
    const browser = await puppeteer.launch(puppeteerDefaultOptions)
    const page = await browser.newPage()

    await page.setViewport(screenSize);

    const response = await page.goto(url)
    await page.waitForTimeout(2000)
    await page.waitForSelector(".close")
    await page.$eval(".close",el=>el.click())

    await page.type("#txtUserName",config.cms_username)
    await page.type("#txtPassword",config.cms_password)

    await page.waitForTimeout(2000)
    await page.click("#btnSubmit")
    await page.waitForTimeout(2000)

    await page.waitForSelector(".right-panel")
    await page.evaluate((ip)=>{
      const element = document.querySelector(".right-panel")
      const child = document.createElement("div");
      child.className = "box"
      child.innerHTML = ip
      element.appendChild(child)
    },`${page.url()} ${response.remoteAddress().ip}`)
    await page.screenshot({path:`${folder}/${url.split(".")[0].split("/")[2]}_${ip}_cms.png`,fullPage:false})
    await browser.close()
}

async function main(){
    await start("https://cms2.kehakiman.gov.my/CommonWeb/LandingPage.aspx","10.19.14.137")
    await start("https://cms2.kehakiman.gov.my/CommonWeb/LandingPage.aspx","10.19.14.138")
    await start("https://cms2.kehakiman.gov.my/CommonWeb/LandingPage.aspx","10.19.14.139")
    await start("https://cms2.kehakiman.gov.my/CommonWeb/LandingPage.aspx","10.19.14.149")
    await start("https://cms2.kehakiman.gov.my/CommonWeb/LandingPage.aspx","10.19.14.8")
    await start("https://cms2.kehakiman.gov.my/CommonWeb/LandingPage.aspx","10.19.14.9")
}

main()