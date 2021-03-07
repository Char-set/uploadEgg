/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1615017870024_1811';

  // add your middleware config here
  config.middleware = ['printParams'];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.multipart = {
    mode: 'file',
    fileSize: '500mb',
    fileExtensions: ['.dmg','','.pdf']
  };
  config.security = {
		csrf: {
			enable: false,
			ignoreJSON: true
		},
		domainWhiteList: ['*']
	}
	config.cors = {
		origin: '*',
		allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
	};

  config.bodyParser = {
		jsonLimit: '500mb',
    formLimit: '500mb',
	}

  return {
    ...config,
    ...userConfig,
  };
};
