import {
    Controller,
    Post,
    Query,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('files')
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @Auth('admin')
    @Post()
    @UseInterceptors(FileInterceptor('files'))
    async uploadFiles(
        @UploadedFiles() files: Express.Multer.File[],
        @Query('folder') folder?: string,
    ) {
        return this.fileService.uploadFiles(files, folder);
    }
}
