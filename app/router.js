'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/file/upload', controller.home.upload)
  router.post('/file/merge_chunk', controller.home.mergeChunks)
  router.post('/file/check', controller.home.checkFile)
};
