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
    let pageList = await page.$$eval("b > a");
    // let pageList = await page.$$("b > a");
    await pageList.forEach(async link => {
      console.log(link);
      await Promise.all([page.waitForNavigation(), page.click(link)]);
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
            console.log(JSON.stringify(companyData));
          }
        });

        companyData = companyData.filter(
          (a, b) => companyData.indexOf(a) === b
        );
        companyData = companyData.filter(e => e.status === "Active");
        // console.log(JSON.stringify(pageList[step].innerText));
        return companyData;
      });
      fullResult = [...fullResult, ...result];
    });

    // result = await page.evaluate(
    //   (fullResult, clickLink) => {
    //     let row = document.querySelectorAll("tr");
    //     let companyData = [];

    //     for (let step = 0; step < 2; step++) {
    //       row.forEach(el => {
    //         let company = {};
    //         let count = 0;
    //         for (data of el.cells) {
    //           switch (count) {
    //             case 0:
    //               company.name = data.innerText.trim();
    //             case 1:
    //               company.primaryContact = data.innerText.trim();
    //             case 2:
    //               company.address = data.innerText.trim();
    //             case 3:
    //               company.phone = data.innerText.trim();
    //             case 4:
    //               company.county = data.innerText.trim();
    //             case 5:
    //               company.status = data.innerText.trim();
    //             default:
    //               company.default = data.innerText.trim();
    //           }
    //           count++;
    //           companyData.push(company);
    //           //GOT SOME STUUFFFF
    //           console.log(JSON.stringify(companyData));
    //         }
    //       });

    //       companyData = companyData.filter(
    //         (a, b) => companyData.indexOf(a) === b
    //       );
    //       companyData = companyData.filter(e => e.status === "Active");
    //       fullResult = [...fullResult, ...companyData];
    //       // console.log(JSON.stringify(pageList[step].innerText));
    //       clickLink(pageList[step]);
    //     }
    //     return fullResult;
    //   },
    //   fullResult,
    //   clickLink
    // );

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
