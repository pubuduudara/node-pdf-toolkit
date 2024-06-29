import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { PDFDocument } from "pdf-lib";
export class PdfGenerateService {
  /**
   * generate pdf from a given html
   * @param imageName
   * @param htmlContent
   * @param outputFolder
   * @returns
   */
  async generatePdfFromHtml(
    imageName: string,
    htmlContent: string,
    outputFolder: string
  ) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Wait for the image to load completely
    await page.waitForSelector("img", { visible: true, timeout: 30000 }); // 30 seconds timeout
    const pdfPath = `${outputFolder}/${path.parse(imageName).name}.pdf`;

    //create folder structure
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }
    await page.pdf({ path: pdfPath, format: "A4" });
    await browser.close();
    return pdfPath;
  }

  async mergePdfs(
    pdfLocations: string[],
    outputDir: string,
    userId: string
  ): Promise<string> {
    const mergedPdf = await PDFDocument.create();
    for (const location of pdfLocations) {
      const loadedPdf = await PDFDocument.load(fs.readFileSync(location));
      const copiedPages = await mergedPdf.copyPages(
        loadedPdf,
        loadedPdf.getPageIndices()
      );
      copiedPages.forEach(page => mergedPdf.addPage(page));
    }
    const pdfPath = `${outputDir}/${path.parse(userId).name}.pdf`;
    fs.writeFileSync(pdfPath, await mergedPdf.save());
    return pdfPath;
  }
}
