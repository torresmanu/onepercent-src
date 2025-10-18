import * as path from "path";
const sanitize = require("sanitize-filename");
import {nanoid} from "nanoid";
import * as sharp from 'sharp';
import * as fsExtra from "fs-extra";
import {Injectable, Logger} from "@nestjs/common";
import * as fs from 'fs';

@Injectable()
export class StorageService {

    private storagePath: any;
    private readonly logger = new Logger(StorageService.name);

    constructor() {
        this.storagePath = process.env.UPLOADS_DIR;
    }

    async normalize(filename: any) {
        let mRet = filename.split(" ").join("_");
        mRet = encodeURI(sanitize(mRet));

        let fileParts = mRet.split(".");
        let extension = "";
        let rawFilename = "";
        if (fileParts.length > 0) {
            // Get file extension as last file part
            extension = fileParts[fileParts.length - 1];
            rawFilename = fileParts.slice(0, -1).join(".");
        }
        return { filename: mRet, extension, rawFilename };
    }

    async saveUserProfile(file: any, userId: any) {
        // file.name = await this.normalize(file.name);
        const { filename: filenameOrig, extension: extensionOrig, rawFilename: rawFilenameOrig } = await this.normalize(nanoid(15));
        const { filename: filenameRedim, extension: extensionRedim, rawFilename: rawFilenameRedim } = await this.normalize(nanoid(15));
        const extension = path.extname(file.originalname);

        const partialPath = "users/" + userId + "/images/";
        let filename = process.env.UPLOADS_PARTIAL + partialPath + filenameRedim + extension;
        let filePath = partialPath + filenameOrig + extension;
        let filePathRedim = partialPath + filenameRedim + extension;
        // Create directory recursively
        await fs.promises.mkdir(this.storagePath + partialPath, { recursive: true });
        fs.writeFileSync(this.storagePath + filePath, file.buffer);

        // Redimension to 500px height
        const outputFilePath = this.storagePath + filePathRedim;
        const inputFilePath = this.storagePath + filePath;
        await sharp(inputFilePath)
            .resize(Number(process.env.USER_IMAGE_RESIZING_WIDTH) || 500)
            .toFile(outputFilePath);

        // Delete orig file
        fsExtra.removeSync(this.storagePath + filePath);

        return filename;
    }

    async saveCapsuleImage(file: any, capsuleId: any) {
        const { filename: filenameOrig, extension: extensionOrig, rawFilename: rawFilenameOrig } = await this.normalize(nanoid(15));
        const { filename: filenameRedim, extension: extensionRedim, rawFilename: rawFilenameRedim } = await this.normalize(nanoid(15));
        const extension = path.extname(file.originalname);

        const partialPath = "capsules/" + capsuleId + "/images/";
        let filename = process.env.UPLOADS_PARTIAL + partialPath + filenameRedim + extension;
        let filePath = partialPath + filenameOrig + extension;
        let filePathRedim = partialPath + filenameRedim + extension;
        // Create directory recursively
        await fs.promises.mkdir(this.storagePath + partialPath, { recursive: true });
        fs.writeFileSync(this.storagePath + filePath, file.buffer);

        // Redimension to 500px height
        const outputFilePath = this.storagePath + filePathRedim;
        const inputFilePath = this.storagePath + filePath;
        await sharp(inputFilePath)
            .resize(Number(process.env.USER_IMAGE_RESIZING_WIDTH) || 500)
            .toFile(outputFilePath);

        // Delete orig file
        fsExtra.removeSync(this.storagePath + filePath);

        return filename;
    }

    async deleteUserPhoto(photoUrl: any) {
        let dir = __dirname + "/../public/" + photoUrl;

        // Delete files
        fsExtra.removeSync(dir);
        return true;
    }

    async deleteCategoryPhoto(imagePath: any): Promise<boolean> {

        const path = __dirname + "/../public/" + process.env.UPLOADS_PARTIAL + "/" + imagePath;

        // Delete file
        await fsExtra.unlink(path);

        return true;

    }


    getUrl = async (filePath: any) => this.storagePath + filePath;
}