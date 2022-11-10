const puppeteer = require("puppeteer")
const fs = require("fs")
const utils = require("./utils")
const config = require("./config")
screenSize = config.screenSize

screenSize.height = 100;

folder = `images/${utils.getDate()}_cms_common`

if (!fs.existsSync(folder)){
  fs.mkdirSync(folder)
}

  const puppeteerDefaultOptions = {
    headless: false,
    args: [
        `--window-size=${screenSize.width},${screenSize.height}`,
    ],
  };

async function start(url){
    const browser = await puppeteer.launch(puppeteerDefaultOptions)
    const page = await browser.newPage()

    await page.setViewport(screenSize);

    const response = await page.goto(url)
    await page.evaluate((text)=>{
        const element = document.querySelector("body")
        const p = document.createElement("p")
        p.innerText = text
        element.appendChild(p)
    },`${page.url()} ${response.remoteAddress().ip}`)
    await page.screenshot({path:`${folder}/${url.split(".")[0].split("/")[2]}_cms_common.png`,fullPage:false})
    await browser.close()
}

async function main(){
    await start("http://cms-ap01.com/commonwebservice/")
    await start("http://cms-ap02.com/commonwebservice/")
    await start("http://cms-ap03.com/commonwebservice/")
    await start("http://cms-ap04.com/commonwebservice/")
    await start("http://cms-ap05.com/commonwebservice/")
    await start("http://cms-ap06.com/commonwebservice/")
}

main()