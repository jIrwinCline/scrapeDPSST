(async () => {
  try {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.goto(
      "http://dpsstnet.state.or.us/IRIS_PublicInquiry/PrivateSecurity/SMSAgcyTable.aspx"
    );

    //Clicks a tag by id
    await page.$eval("#btnNALL", el => el.click());

    await page.screenshot({
      path: "./screenshots/page1.png"
    });
    await page.pdf({ path: "./pdfs/page1.pdf" });

    await browser.close();
  } catch (error) {
    console.log(error);
  }
})();
//
// const puppeteer = require("puppeteer");

// let pageCount = 1; // 21 full pages of content

// const companies = await page.evaluate(() => {
//   const grabFromRow = row => row.innerText.trim();

//   const ROW_SELECTOR = "tr";
//   const data = [];

//   const companyRows = document.querySelectorAll(ROW_SELECTOR);

//   for (const tr of companyRows) {
//     data.push(tr);
//   }
//   console.log(data);
// })(async () => {
//   try {
//     const browser = await puppeteer.launch();

//     const page = await browser.newPage();

//     await page.goto(
//       "http://dpsstnet.state.or.us/IRIS_PublicInquiry/PrivateSecurity/SMSAgcyTable.aspx"
//     );

//     //Clicks a tag by id
//     await page.$eval("#btnNALL", el => el.click());
//     companies();
//     await page.screenshot({
//       path: "./screenshots/page1.png"
//     });
//     await page.pdf({ path: "./pdfs/page1.pdf" });

//     await browser.close();
//   } catch (error) {
//     console.log(error);
//   }
// })();
