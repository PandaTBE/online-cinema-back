import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import { IFileResponse } from './file.interface';

@Injectable()
export class FileService {
    async uploadFiles(
        files: Express.Multer.File[],
        folder = 'default',
    ): Promise<IFileResponse[]> {
        const uploadFolder = `${path}/uploads/${folder}`;
        await ensureDir(uploadFolder);

        const result: IFileResponse[] = await Promise.all(
            files?.map(async (file) => {
                await writeFile(
                    `${uploadFolder}/${file.originalname}`,
                    file.buffer,
                );

                return {
                    url: `uploads/${file.originalname}`,
                    name: file.originalname,
                };
            }),
        );
        return result;
    }
}
