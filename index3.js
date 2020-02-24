const puppeteer = require("puppeteer");
// var fs = require("fs");
const fsp = require("fs").promises;

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
    // page.evaluate(() => console.log("hello", 5, { foo: "bar" }));
    await page.goto(
      "http://dpsstnet.state.or.us/IRIS_PublicInquiry/PrivateSecurity/SMSAgcyTable.aspx"
    );

    //Clicks a tag by id
    // await page.$eval("#btnNALL", el => el.click());
    await page.click("#btnNaLL");
    //
    await page.waitFor(1000);

    const result = await page.evaluate(() => {
      let row = document.querySelectorAll("tr");
      //   for (var i = 0; i < companyRows.length; i++) {
      //     console.log(companyRows[i].cells);
      //   }
      row.forEach(el => {
        // console.log(el.cells);
        for (data of el.cells) {
          //GOT SOME STUUFFFF
          console.log(data.innerText);
        }
      });
      return row;
    });
    // await page.evaluate(() => {
    //   //   await page.addScriptTag({ path: './node_modules/fs/build/fs.js' });
    //   companyRows = document.querySelectorAll("tr");
    //   console.log(companyRows);
    // });

    // for (var i = 0; i < companyRows.length; i++) {
    //   console.log(companyRows[i].cells);
    // }
    //
    // await page
    //   .$eval(() => {
    //     const grabFromRow = row => row.innerText.trim();
    //     const grabFromData = data => data.innerText.trim();
    //     const data = [];

    //     const companyRows = document.querySelectorAll("tr");

    //     for (const tr of companyRows) {
    //       data.push(tr);
    //     }
    //     return data;
    //   })
    //   .then(val => {
    //     console.log(val);
    //   });
    //
    await page.screenshot({
      path: "./screenshots/page1.png"
    });
    await page.pdf({ path: "./pdfs/page1.pdf" });

    await browser.close();
    // await page.waitFor(3000);
    // await fsp.writeFile("./json/file.json", result.stringify());
    return result;
  } catch (error) {
    console.log(error);
  }
})();
// calling logic
// scrape().then(value => {
//   console.log(value);
// });
