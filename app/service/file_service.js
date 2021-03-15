'use strict';

const Service = require('egg').Service;

const fs = require('fs')
const path = require('path')

const fileDist = path.join('./', 'fileDist');

const filePiecesDist = path.join('./','filePiecesDist')

class File_serviceService extends Service {
    async uploadFile(file, fileName, fileMd5, chunkNth) {

        let realFile = fs.readFileSync(file.filepath);

		const chunkPath = `${filePiecesDist}/${fileName}-${fileMd5}`;

		if(!fs.existsSync(filePiecesDist)) fs.mkdirSync(filePiecesDist);

		if (!fs.existsSync(chunkPath)) fs.mkdirSync(chunkPath);

		fs.writeFileSync(path.join('./', `${filePiecesDist}/${fileName}-${fileMd5}/${fileName}-${fileMd5}-${chunkNth}`), realFile);

        return 'ok'

    }

    async mergeChunks(fileName, fileMd5, chunksTotal) {

        if(!fs.existsSync(fileDist)) fs.mkdirSync(fileDist);

		let tempPath = `${fileDist}/${fileMd5}`
		if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath);

		const filePath = path.join(tempPath, fileName);
		// 创建存储文件
		fs.writeFileSync(filePath, '');

		const chunksPath = `${filePiecesDist}/${fileName}-${fileMd5}`;

		// 获取暂存的所有chunk
		const chunks = fs.readdirSync(chunksPath);

		if (chunks.length != chunksTotal) {
			ctx.helper.__errorHandle('文件切片数量不符');
			return;
		}

		for (let i = 0; i < chunksTotal; i++) {
			let tempChunkPath = `${chunksPath}/${fileName}-${fileMd5}-${i}`;

			fs.appendFileSync(filePath, fs.readFileSync(tempChunkPath));

			fs.unlinkSync(tempChunkPath);
		}

		fs.rmdirSync(chunksPath);

        return 'ok'
    }


    async checkFileChunk(fileName, fileMd5, filePieces) {
        let filePath = `${fileDist}/${fileMd5}/${fileName}`;

		// 文件已存在，秒传
		if(fs.existsSync(filePath)) {
			return {status:'file exist', filePath};
		}

        const chunksPath = `${filePiecesDist}/${fileName}-${fileMd5}`;

		if (!fs.existsSync(chunksPath)) {
			return {status:'file not exist'};
		}

        // 获取暂存的所有chunk
		const chunks = fs.readdirSync(chunksPath);


		let leftPieces = (filePieces || []).filter((item) => {
			return chunks.indexOf(`${fileName}-${fileMd5}-${item.index}`) == -1
		});

		console.log('leftPieces:',leftPieces);

		// 有文件碎片需要上传
		if(leftPieces.length > 0) {
			return {status:'file need continue upload',leftPieces};
		} else {
			// 所有文件碎片都上传，进行合并
			await this.mergeChunks(fileName, fileMd5, filePieces.length);
			return {status:'file exist', filePath};
		}
    }
}

module.exports = File_serviceService;
