const puppeteer = require("puppeteer");
// var fs = require("fs");
const fsp = require("fs").promises;
const fs = require("fs");

let pageCount = 1; // 21 full pages of content
let companyRows;
let pageToClick;
function delay(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
}

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const clickLink = link => {
      page.click(link);
      page.waitFor(1000);
    };
    page.on("console", msg => {
      for (let i = 0; i < msg.args().length; ++i)
        console.log(`${i}: ${msg.args()[i]}`);
    });

    await page.goto(
      "http://dpsstnet.state.or.us/IRIS_PublicInquiry/PrivateSecurity/SMSAgcyTable.aspx"
    );

    //Clicks a tag by id

    await page.click("#btnNaLL");

    await page.waitFor(1000);
    let fullResult = [];
    let result;

    // let pageList = await page.evaluate(() => {
    //   return document.querySelectorAll("b > a");
    // });
    // let pageList = await page.$$eval("a > b", elements => {
    //   return elements;
    // });
    // let pageList = await page.$$eval("b > a", pageList => {
    //   return pageList;
    // });
    // let pageList = await page.$$("b > a");
    let times = 0;
    let step = 0;
    while (times < 1 || step !== 11) {
      console.log(`step: ${step}, time: ${times}`);
      if (times < 1 && step === 10) {
        // console.log("if statement");
        step = 1;
        times++;
      }
      // await page.evaluate(step => {
      //   document.querySelectorAll("b > a")[step].click();
      // }, step);
      // await page.$$eval('b > a', elements => elements[step].click());
      // console.log(link);

      //SCRAPE
      result = await page.evaluate(() => {
        let row = document.querySelectorAll("tr");
        let companyData = [];

        row.forEach(el => {
          let company = {};
          let count = 0;
          for (data of el.cells) {
            switch (count) {
              case 0:
                company.name = data.innerText.trim();
              case 1:
                company.primaryContact = data.innerText.trim();
              case 2:
                company.address = data.innerText.trim();
              case 3:
                company.phone = data.innerText.trim();
              case 4:
                company.county = data.innerText.trim();
              case 5:
                company.status = data.innerText.trim();
              default:
                company.default = data.innerText.trim();
            }
            count++;
            companyData.push(company);
            //GOT SOME STUUFFFF
            // console.log(JSON.stringify(companyData));
          }
        });
        //FILTER BAD DATA
        companyData = companyData.filter(
          (a, b) => companyData.indexOf(a) === b
        );
        companyData = companyData.filter(e => e.status === "Active");
        // console.log(JSON.stringify(pageList[step].innerText));
        return companyData;
      });
      //CLICK
      await Promise.all([
        page.waitForNavigation(),
        page.evaluate(step => {
          // console.log(`step inside: ${step}`);
          console.log(
            JSON.stringify(document.querySelectorAll("b > a")[step].innerText)
          );
          document.querySelectorAll("b > a")[step].click();
        }, step)
      ]);
      step++;
      //
      fullResult = [...fullResult, ...result];
      //SCRAPE AGAIN ON LAST PAGE
      if (times === 1 && step === 11) {
        result = await page.evaluate(() => {
          let row = document.querySelectorAll("tr");
          let companyData = [];

          row.forEach(el => {
            let company = {};
            let count = 0;
            for (data of el.cells) {
              switch (count) {
                case 0:
                  company.name = data.innerText.trim();
                case 1:
                  company.primaryContact = data.innerText.trim();
                case 2:
                  company.address = data.innerText.trim();
                case 3:
                  company.phone = data.innerText.trim();
                case 4:
                  company.county = data.innerText.trim();
                case 5:
                  company.status = data.innerText.trim();
                default:
                  company.default = data.innerText.trim();
              }
              count++;
              companyData.push(company);
              //GOT SOME STUUFFFF
              // console.log(JSON.stringify(companyData));
            }
          });
          //FILTER BAD DATA
          companyData = companyData.filter(
            (a, b) => companyData.indexOf(a) === b
          );
          companyData = companyData.filter(e => e.status === "Active");
          // console.log(JSON.stringify(pageList[step].innerText));
          return companyData;
        });
        fullResult = [...fullResult, ...result];
      }
    }

    await fsp.writeFile(
      "./json/file.json",
      JSON.stringify(fullResult, null, 2),
      err =>
        err
          ? console.error("Data not written!", err)
          : console.log("Data Written")
    );
    //*
    await page.screenshot({
      path: "./screenshots/page1.png"
    });
    await page.pdf({ path: "./pdfs/page1.pdf" });
    await browser.close();
    return result;
  } catch (error) {
    console.log(error);
  }
})();
