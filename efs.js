const puppeteer = require("puppeteer")
const fs = require("fs")
const utils = require("./utils")
const config = require("./config")
screenSize = config.screenSize

folder = `images/${utils.getDate()}_web`

if (!fs.existsSync(folder)){
  fs.mkdirSync(folder)
}

  const puppeteerDefaultOptions = {
    headless: false,
    args: [
        `--window-size=${screenSize.width},${screenSize.height}`,
    ],
  };
async function start(url) {
    const browser = await puppeteer.launch(puppeteerDefaultOptions)
    const page = await browser.newPage()

    await page.setViewport(screenSize);

    page.on('dialog', async dialog => {
        //get alert message
        console.log(dialog.message());
        //accept alert
        await dialog.accept();
     })

    const response = await page.goto(url)
    const selector = ".rwTable";
    await page.waitForSelector(selector)
  	await page.evaluate(()=>{
      const element = document.querySelector(".TelerikModalOverlay")
      element.parentNode.removeChild(element)
    })
    await page.click("#HeaderLoginBtn")
    await page.waitForTimeout(1000)
    const frame = page.frames().find(frame => frame.url().includes('LoginWindow.aspx'));
    await frame.type("#Body_LoginLogin_UserName",config.efs_username,{delay:100})
    await frame.type("#Body_LoginLogin_Password",config.efs_password,{delay:100})
    await frame.click("#Body_LoginLogin_LoginButton")
    await page.waitForSelector("#MyFilingMenu")
    await page.waitForSelector(".right-panel")
    await page.evaluate((text)=>{
      const element = document.querySelector(".right-panel")
      const child = document.createElement("div");
      child.className = "box"
      child.innerHTML = text
      element.appendChild(child)
    },`${page.url()} ${response.remoteAddress().ip}`)

    await page.waitForTimeout(1000)
    await page.screenshot({path:`${folder}/${url.split(".")[0].split("/")[2]}_web.png`,fullPage:false})
    await browser.close()
}

async function main(){
  await start("http://efs-web01.com/EfsWeb/eFiling/MyFiling.aspx")
  // await start("http://efs-web02.com/EfsWeb/eFiling/MyFiling.aspx")
  // await start("http://efs-web03.com/EfsWeb/eFiling/MyFiling.aspx")
  // await start("http://efs-web04.com/EfsWeb/eFiling/MyFiling.aspx")
}

main()