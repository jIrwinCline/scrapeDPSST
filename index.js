const puppeteer = require("puppeteer");

(async () => {
  try {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.goto(
      "http://dpsstnet.state.or.us/IRIS_PublicInquiry/PrivateSecurity/SMSAgcyTable.aspx"
    );

    await page.screenshot({
      path: "./screenshots/page1.png"
    });
    await page.pdf({ path: "./pdfs/page1.pdf" });

    await browser.close();
  } catch (error) {
    console.log(error);
  }
})();
