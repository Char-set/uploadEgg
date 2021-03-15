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

		// 上传文件
		await ctx.service.fileService.uploadFile(file, fileName, fileMd5, chunkNth);


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

		// 合并文件碎片
		await ctx.service.fileService.mergeChunks(fileName, fileMd5, chunksTotal);

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
		

		let data = await ctx.service.fileService.checkFileChunk(fileName, fileMd5, filePieces)


		ctx.body = ctx.helper.__newMsg(200, 'ok', data);

	}
}

module.exports = HomeController;
