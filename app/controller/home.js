'use strict';

const fs = require('fs')
const path = require('path')

const fileDist = path.join('./', 'fileDist');

const filePiecesDist = path.join('./','filePiecesDist')

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


		const chunkPath = `${filePiecesDist}/${fileName}-${fileMd5}`;

		if(!fs.existsSync(filePiecesDist)) fs.mkdirSync(filePiecesDist);

		if (!fs.existsSync(chunkPath)) fs.mkdirSync(chunkPath);

		fs.writeFileSync(path.join('./', `${filePiecesDist}/${fileName}-${fileMd5}/${fileName}-${fileMd5}-${chunkNth}`), realFile)
		// ctx.cleanupRequestFiles()


		ctx.body = { code: 200, message: '', data: fileName }

	}

	async mergeChunks() {
		const { ctx } = this;

		const { fileName, fileMd5, chunksTotal } = ctx.request.body;

		if (!fileName) {
			ctx.helper.__errorHandle(`fileName is require`);
			return;
		}

		if (!fileMd5) {
			ctx.helper.__errorHandle(`fileMd5 is require`);
			return;
		}

		if (!chunksTotal) {
			ctx.helper.__errorHandle(`chunksTotal is require`);
			return;
		}
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

		ctx.body = ctx.helper.__newMsg(200, 'ok', `/fileDist/${fileMd5}/${fileName}`);
	}

	async checkFile() {
		const { ctx } = this;

		const { fileMd5, filePieces, fileName } = ctx.request.body;

		if(!fileMd5) {
			ctx.helper.__errorHandle(`fileMd5 is require`);
			return;
		}

		if(!filePieces) {
			ctx.helper.__errorHandle(`filePieces is require`);
			return;
		}

		if(!fileName) {
			ctx.helper.__errorHandle(`fileName is require`);
			return;
		}

		let filePath = `${fileDist}/${fileMd5}/${fileName}`;

		// 文件已存在，秒传
		if(fs.existsSync(filePath)) {
			ctx.body = ctx.helper.__newMsg(200, 'ok', {status:'file exist', filePath});
			return;
		}

		const chunksPath = `${filePiecesDist}/${fileName}-${fileMd5}`;

		if (!fs.existsSync(chunksPath)) {
			ctx.body = ctx.helper.__newMsg(200, 'ok', {status:'file not exist'});
			return;
		}

		// 获取暂存的所有chunk
		const chunks = fs.readdirSync(chunksPath);

		console.log(chunks);

		let leftPieces = (filePieces || []).filter((item,idx) => {
			return chunks.indexOf(`${fileName}-${fileMd5}-${item.index}`) == -1
		});

		console.log('leftPieces:',leftPieces);

		if(leftPieces.length > 0) {
			ctx.body = ctx.helper.__newMsg(200, 'ok', {status:'file need continue upload',leftPieces});
			return;
		}


		ctx.body = ctx.helper.__newMsg(200, 'ok', {status:'file not exist'});

	}
}

module.exports = HomeController;
