module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      chainWebpackMainProcess: (config) => {
        config.module
          .rule("unlazy-loader")
          .test(/\.js$/)
          .use("unlazy-loader")
          .loader("unlazy-loader")
          .end();
      },
    },
  },
};
