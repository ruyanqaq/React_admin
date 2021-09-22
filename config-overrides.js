//配置具体的修改规则
const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
	//按需打包，根据import打包(使用babel-plugin-import)
	fixBabelImports('import', {
		libraryName: 'antd',
		libraryDirectory: 'es',
		style: true
	}),
	addLessLoader({
		lessOptions: {
			javascriptEnabled: true,
			modifyVars: { '@primary-color': 'green' },
		}
	}),
);  
