import { Data } from "hono/dist/types/context";
import { getTemplate } from "../templates";
import Handlebars = require("handlebars");
import puppeteer from "puppeteer-core";
import Chromium from "@sparticuz/chromium";

Handlebars.registerHelper("isTotal", function (key: string, options) {
  return key === "total" ? options.fn(this) : options.inverse(this);
});
Handlebars.registerHelper("formatCurrency", (value) => {
  return new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 0,
  }).format(value);
});
interface Args {
  landscape?: boolean;
}
export const generateReport = async (
  templateName: string,
  data: any,
  args?: Args,
) => {
  const browser = await puppeteer.launch({
    args: Chromium.args,
    executablePath: await Chromium.executablePath(),
    headless: true,
  });
  try {
    const source = await getTemplate(templateName);
    const template = Handlebars.compile(source);
    const html = template(data);
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "domcontentloaded" });
    const style = await Bun.file("./src/templates/global.css").text();
    await page.addStyleTag({
      content: style,
    });
    await page.emulateMediaType("screen");
    const buffer = await page.pdf({
      format: "LETTER",
      printBackground: true,
      landscape: args?.landscape ?? false,
      displayHeaderFooter: true,
      margin: {
        top: "90px",
        bottom: "70px",
        left: "40px",
        right: "40px",
      },
      headerTemplate: `
          <div style="font-size:10px; width:100%; padding:0 40px; display:flex; justify-content:space-between;">
            <span>Ebenezer IMAC</span>
            <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
          </div>
        `,
      footerTemplate: `
          <div style="font-size:9px; width:100%; padding:0 40px; text-align:right;">
            Generado el ${new Date().toLocaleString("es-CO", {
              dateStyle: "full",
              timeStyle: "medium",
            })}
          </div>
        `,
    });
    return buffer as Data;
  } finally {
    await browser.close();
  }
};
