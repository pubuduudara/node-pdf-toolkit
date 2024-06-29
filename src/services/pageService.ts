import { Page } from "src/dao/entities/Page";
import { PageDao } from "src/dao/pageDao";
import { S3Service } from "./s3Service";
import { S3_FOLDERS, S3_OPERATIONS } from "src/constants";
import { PageDto } from "src/dto/PageDto";
import { plainToClass } from "class-transformer";

export class PageService {
  private pageDao: PageDao;
  private s3Service: S3Service;

  constructor(pageDao: PageDao, s3Service: S3Service) {
    this.pageDao = pageDao;
    this.s3Service = s3Service;
  }
  /**
   * Get all pages by user id
   * @param userId
   * @returns
   */
  async getPagesByUserId(userId: string): Promise<PageDto[]> {
    // get all user pages
    const pageList: Page[] = await this.pageDao.getPages(userId);
    // attach image url to each page
    const pageDtoList: PageDto[] = plainToClass(PageDto, pageList);
    const s3FolderPath = `${S3_FOLDERS.COVER_IMAGES}/${userId}`;
    for (const page of pageDtoList) {
      const imageUrl = await this.s3Service.getPreSignedUrl(
        process.env.S3_BUCKET,
        s3FolderPath,
        page.imageName,
        S3_OPERATIONS.GET_OBJECT
      );
      page.imageUrl = imageUrl;
    }
    return pageDtoList;
  }
}
