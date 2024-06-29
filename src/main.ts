import { OUTPUT_FOLDER } from "./constants";
import { PageDto } from "./dto/PageDto";
import { HtmlService } from "./services/htmlService";
import { PageService } from "./services/pageService";
import { PdfGenerateService } from "./services/pdfGenerateService";

export class Main {
  private pageService: PageService;
  private htmlService: HtmlService;
  private pdfGenerateService: PdfGenerateService;

  constructor(
    pageService: PageService,
    htmlService: HtmlService,
    pdfGenerateService: PdfGenerateService
  ) {
    this.pageService = pageService;
    this.htmlService = htmlService;
    this.pdfGenerateService = pdfGenerateService;
  }

  async createPdf(userId: string) {
    try {
      const pages: PageDto[] = await this.pageService.getPagesByUserId(userId);
      const pdfPagesLocalPaths: string[] = [];
      for (const page of pages) {
        const htmlImageTemplate: string = this.htmlService.getHtmlImageTemplate(
          page.imageName,
          page.imageUrl
        );
        const pdfPagePath = await this.pdfGenerateService.generatePdfFromHtml(
          page.imageName,
          htmlImageTemplate,
          `${OUTPUT_FOLDER}/${userId}`
        );
        pdfPagesLocalPaths.push(pdfPagePath);
      }

      // merge pdfs to a single pdf
      const mergedPdfLocalPath = await this.pdfGenerateService.mergePdfs(
        pdfPagesLocalPaths,
        `${OUTPUT_FOLDER}/${userId}`,
        userId
      );
    } catch (error) {
      console.log(`Failed to create pdf. Error: ${error}`);
    }
  }
}
