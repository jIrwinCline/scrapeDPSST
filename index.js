const puppeteer = require("puppeteer");
// var fs = require("fs");
const fsp = require("fs").promises;
const fs = require("fs");

let pageCount = 1; // 21 full pages of content
let companyRows;
function delay(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
}

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
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

    const result = await page.evaluate(() => {
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

      // await page.waitFor(3000);
      // await fsp.writeFile("./json/file.json", result.stringify());
      companyData = companyData.filter((a, b) => companyData.indexOf(a) === b);
      companyData = companyData.filter(e => e.status === "Active");
      return companyData;
    });

    // fsp.writeFile(
    //   "./json/file.json",
    //   JSON.stringify(companyData, null, 2),
    //   err =>
    //     err
    //       ? console.error("Data not written!", err)
    //       : console.log("Data Written")
    // );

    await fsp.writeFile(
      "./json/file.json",
      JSON.stringify(result, null, 2),
      err =>
        err
          ? console.error("Data not written!", err)
          : console.log("Data Written")
    );
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
