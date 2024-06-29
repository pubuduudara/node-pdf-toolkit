/* eslint-disable prettier/prettier */
import { DataSource, Repository } from "typeorm";
import { Page } from "./entities/Page";

export class PageDao {
  private pageRepo: Repository<Page>;
  private dataSource: DataSource;

  constructor(pageRepo: Repository<Page>, dataSource: DataSource) {
    this.pageRepo = pageRepo;
    this.dataSource = dataSource;
  }
  /**
   * Get all pages by user id
   * @param userId
   * @returns
   */
  async getPages(userId: string): Promise<Page[]> {
    const pageList: Page[] = await this.pageRepo.find({
      where: { userId },
      order: { date: "DESC" },
    });
    return pageList;
  }
}
