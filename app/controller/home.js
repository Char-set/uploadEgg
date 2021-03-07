'use strict';

const  fs = require('fs')
const path = require('path')

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  async upload() {
    const { ctx } = this;

    let file = ctx.request.files[0];
    console.log(JSON.stringify(file))
    // let realFile = fs.readFileSync(file.filepath)

    // fs.writeFileSync(path.join('./', `uploadfile/${file.filename}`), realFile)
    // ctx.cleanupRequestFiles()

   
    ctx.body = { code: 200, message: '', data: file.filename}

  }
}

module.exports = HomeController;
