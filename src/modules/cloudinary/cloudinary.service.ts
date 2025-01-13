import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { unlink } from 'node:fs/promises';

@Injectable()
export class CloudinaryService {
  constructor() {
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
    const api_key = process.env.CLOUDINARY_API_KEY;
    const api_secret = process.env.CLOUDINARY_API_SECRET;

    if (!cloud_name || !api_key || !api_secret) {
      throw new Error(
        'Cloudinary configuration is missing in environment variables',
      );
    }

    cloudinary.config({
      cloud_name,
      api_key,
      api_secret,
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    try {
      const { secure_url } = await cloudinary.uploader.upload(file.path, {
        folder,
      });
      await unlink(file.path);
      return secure_url;
    } catch (error) {
      await unlink(file.path);
      throw new InternalServerErrorException(error.message);
    }
  }
}
