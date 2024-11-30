import { Injectable, Logger } from '@nestjs/common';
import { FileListTask } from './task/file-list.task';
import { MenuDrawerTask } from './task/menu-drawer.task';
import { BankListEnum } from '../enum/bank-list.enum';
import { DataExtractAction } from './data-extract.sub-action';

@Injectable()
export class FileStatementListAction {
  constructor(
    private readonly fileListTask: FileListTask,
    private readonly menuDrawerTask: MenuDrawerTask,
    private readonly dataExtractAction: DataExtractAction,
    private readonly logger: Logger,
  ) {}

  public async run() {
    this.logger.log('Reading directory...');

    try {
      const statementFilesList = await this.fileListTask.run();
      const selectedFiles = await this.menuDrawerTask.run(statementFilesList);
      selectedFiles.forEach((filePath, index) => {
        const bankName = Object.values(BankListEnum)[index];
        this.logger.log(`\x1b[1m${bankName}:\x1b[0m \t=> ${filePath}`);
        const data = this.dataExtractAction
          .setFilePath(filePath)
          .setBankName(bankName)
          .run();

        const total = 0;
      });
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
