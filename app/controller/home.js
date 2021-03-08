'use strict';

const fs = require('fs')
const path = require('path')

const fileDist = path.join('./', 'fileDist');

const Controller = require('egg').Controller;

class HomeController extends Controller {
	async index() {
		const { ctx } = this;
		ctx.body = 'hi, egg';
	}

	async upload() {
		const { ctx } = this;
		const { fileName, fileMd5, chunkNth } = ctx.request.body;
		let file = ctx.request.files[0];

		console.log(JSON.stringify(file));

		let realFile = fs.readFileSync(file.filepath);


		const chunkPath = `uploadfile/${fileName}-${fileMd5}`;

		if (!fs.existsSync(chunkPath)) fs.mkdirSync(chunkPath);

		fs.writeFileSync(path.join('./', `uploadfile/${fileName}-${fileMd5}/${fileName}-${fileMd5}-${chunkNth}`), realFile)
		// ctx.cleanupRequestFiles()


		ctx.body = { code: 200, message: '', data: fileName }

	}

	async mergeChunks() {
		const { ctx } = this;

		const { fileName, fileMd5, chunksTotal } = ctx.request.body;

		const filePath = path.join(fileDist, fileName);
		// 创建存储文件
		fs.writeFileSync(filePath, '');

		const chunksPath = `uploadfile/${fileName}-${fileMd5}`;

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

		ctx.body = ctx.helper.__newMsg(200, 'ok');
	}
}

module.exports = HomeController;
