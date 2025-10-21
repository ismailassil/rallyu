import * as path from 'path';
import fs, { createWriteStream } from 'fs';
import { MultipartFile } from '@fastify/multipart';
import { pipeline } from 'stream/promises';
import { writeFile } from 'fs/promises';
import axios from 'axios';
const { v4: uuidv4 } = require('uuid');

class CDNService {
	private readonly uploadDir = path.join('.', 'uploads');
	private readonly allowedMimeTypes = ['image/jpg', 'image/jpeg', 'image/png'];

	constructor() {
		if (!fs.existsSync(this.uploadDir))
			fs.mkdirSync(this.uploadDir, { recursive: true });
	}

	async storeFromMultipart(fileData: MultipartFile) {
		if (!this.allowedMimeTypes.includes(fileData.mimetype))
			throw new Error('MIME_TYPE_NOT_ALLOWED');

		const fileExtension = fileData.mimetype.split('/')[1];
		const fileName = `${uuidv4()}.${fileExtension}`;
		const filePath = path.join(this.uploadDir, fileName);

		await pipeline(fileData.file, createWriteStream(filePath));

		return filePath;
	}

	async storeFromURL(url: string) {
		const response = await axios.get(url, {
			responseType: 'arraybuffer',
			timeout: 10000,
			maxContentLength: 10 * 1024 * 1024 // 10MB
		});

		const contentType = response.headers['content-type']?.toString().split(';')[0]?.trim().toLowerCase() || '';

		if (!this.allowedMimeTypes.includes(contentType))
			throw new Error('MIME_TYPE_NOT_ALLOWED');

		const fileExtension = contentType.split('/')[1];
		const fileName = `${uuidv4()}.${fileExtension}`;
		const filePath = path.join(this.uploadDir, fileName);

		await writeFile(filePath, response.data);

		return filePath;
	}
}

export default CDNService;
