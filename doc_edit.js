const puppeteer = require("puppeteer")
const fs = require("fs")
const utils = require("./utils")
const config = require("./config")
screenSize = config.screenSize
folder = `images/${utils.getDate()}_doc_edit`

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
      const element = document.querySelector(".inner-wrapper")
      element.innerHTML = element.innerHTML.replace("Failed to load document.",text)
    },`${page.url()} ${response.remoteAddress().ip}`)

    await page.screenshot({path:`${folder}/${url.split(".")[0].split("/")[2]}_docedit.png`,fullPage:false})
    // await browser.close()
}

async function main(){
    await start("http://efs-web01.com/DocumentEditor/Editor2.aspx?DocumentID=ca8a1bd6-7c77-4b11-8341-0c535236212b&UserID=5fc06c61-d366-4972-845e-bc3463d9b55f&Culture=en-GB")
    // await start("http://efs-web02.com/DocumentEditor/Editor2.aspx?DocumentID=ca8a1bd6-7c77-4b11-8341-0c535236212b&UserID=5fc06c61-d366-4972-845e-bc3463d9b55f&Culture=en-GB")
    // await start("http://efs-web03.com/DocumentEditor/Editor2.aspx?DocumentID=ca8a1bd6-7c77-4b11-8341-0c535236212b&UserID=5fc06c61-d366-4972-845e-bc3463d9b55f&Culture=en-GB")
    // await start("http://efs-web04.com/DocumentEditor/Editor2.aspx?DocumentID=ca8a1bd6-7c77-4b11-8341-0c535236212b&UserID=5fc06c61-d366-4972-845e-bc3463d9b55f&Culture=en-GB")
}

main()