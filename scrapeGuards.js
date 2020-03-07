const puppeteer = require("puppeteer");
// var fs = require("fs");
const fsp = require("fs").promises;
const fs = require("fs");

(async () => {
  try {
    let page1 = true;
    let lastPage = false;
    let fullResult = [];
    let result;
    let times = 0;
    let step = 0;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on("console", msg => {
      for (let i = 0; i < msg.args().length; ++i)
        console.log(`${i}: ${msg.args()[i]}`);
    });
    await page.goto(
      "http://dpsstnet.state.or.us/IRIS_PublicInquiry/PrivateSecurity/smsgoperson.aspx"
    );
    await page.$eval("#txtFindValue", el => (el.value = "*"));
    await page.click("#Button1");
    await page.waitFor(1000);
    let loop = 1;
    while (!lastPage) {
      //   console.log(loop);
      loop++;
      //SCRAPE
      result = await page.evaluate(() => {
        let row = document.querySelectorAll("tr");
        let guardData = [];

        row.forEach(el => {
          let guard = {};
          let count = 0;
          for (data of el.cells) {
            switch (count) {
              case 0:
                guard.name = data.innerText.trim();
              case 1:
                guard.id = data.innerText.trim();
              case 2:
                guard.agency = data.innerText.trim();
              default:
                guard.default = data.innerText.trim();
            }
            count++;
            guardData.push(guard);
            //GOT SOME STUUFFFF
            // console.log(JSON.stringify(guardData));
          }
        });
        //FILTER REPEAT DATA
        guardData = guardData.filter((a, b) => guardData.indexOf(a) === b);
        guardData = guardData.filter(e => e.name.length < 50);
        return guardData;
      });
      fullResult = [...fullResult, ...result];

      // CLICK NEXT PAGE
      await Promise.all([
        page.waitForNavigation(),
        page.evaluate(page1 => {
          let navs = Array.from(document.querySelectorAll("b > a"));
          page1 ? navs[0].click() : navs[1].click();
          // console.log(JSON.stringify(`page1? ${page1}`));
        }, page1)
      ]);
      page1 = false;
      //WRITE JSON
      await fsp.writeFile(
        "./json/guards.json",
        JSON.stringify(fullResult, null, 2),
        err =>
          err
            ? console.error("Data not written!", err)
            : console.log("Data Written")
      );
      //   console.log(lastPage);
      //LAST PAGE?
      //   console.log(page1);
      lastPage = await page.evaluate(() => {
        let navs = document.querySelectorAll("b > a");
        // console.log(navs.length);
        if (navs.length < 2) {
          return true;
        } else {
          return false;
        }
      });
    }

    //SCRAPE LAST PAGE
    if (lastPage) {
      console.log("made it to last page");
    }

    await page.screenshot({
      path: "./screenshots/page1.png"
    });
    await browser.close();
  } catch (error) {
    console.log(error);
  }
})();
