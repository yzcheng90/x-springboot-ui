const url = 'http://localhost:8080'
module.exports = {
	publicPath: './',
	outputDir: 'ui',
	assetsDir: 'static',
	productionSourceMap: false,
	lintOnSave: false,
	devServer: {
		open: false, // 自动打开浏览器
		port: 9999, // 前台代理端口号
		https: false, // https： {type: Booleam}
		hotOnly: false, // 热更新
		proxy: {
			// 设置代理
			'/': {
				target: url,
				ws: false,
				secure: false,
				changeOrigin: true,
				pathRewrite: {
					'^/': '',
				},
			},
		},
	},
	chainWebpack(config) {
		// 移除打包后 index.html 所有打包好的文件都预加载行为
		config.plugins.delete('preload');
		config.plugins.delete('prefetch');
	},
	css: {
		extract: { ignoreOrder: true },
	},
};
