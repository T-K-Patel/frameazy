import "server-only";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
});

export class CloudinaryStorage {
	static upload(file: ArrayBuffer) {
		try {
			return new Promise<UploadApiResponse | undefined>((resolve) => {
				cloudinary.uploader
					.upload_stream((error, uploadResult) => {
						if (error) {
							console.error("CloudinaryStorage.upload error", error);
							return resolve(undefined);
						}
						return resolve(uploadResult);
					})
					.end(Buffer.from(file));
			}).then((uploadResult: UploadApiResponse | undefined) => {
				console.log(uploadResult);
				return uploadResult?.secure_url;
			});
		} catch (error) {
			console.error("CloudinaryStorage.upload error", error);
			return undefined;
		}
	}

	static delete(publicId: string): Promise<boolean> {
		try {
			return new Promise<boolean>((resolve) => {
				cloudinary.uploader.destroy(publicId, (error, result) => {
					if (error) {
						console.error("CloudinaryStorage.delete error", error);
						return resolve(false);
					}
					console.log(result);
					return resolve(true);
				});
			});
		} catch (error) {
			console.error("CloudinaryStorage.delete error", error);
			return Promise.resolve(false);
		}
	}
}
