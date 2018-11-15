// Change theme plugin

import MergeLessPlugin from 'antd-pro-merge-less';
import AntDesignThemePlugin from 'antd-theme-webpack-plugin';
import path from 'path';

export default config => {
  // 将所有 less 合并为一个供 themePlugin使用
  const outFile = path.join(__dirname, '../.temp/ant-design-pro.less');
  const stylesDir = path.join(__dirname, '../src/');

  // config.plugin('merge-less').use(MergeLessPlugin, [
  //   {
  //     stylesDir,
  //     outFile,
  //   },
  // ]);

  // config.plugin('ant-design-theme').use(AntDesignThemePlugin, [
  //   {
  //     antDir: path.join(__dirname, '../node_modules/antd'),
  //     stylesDir,
  //     varFile: path.join(__dirname, '../node_modules/antd/lib/style/themes/default.less'),
  //     mainLessFile: outFile, //     themeVariables: ['@primary-color'],
  //     indexFileName: 'index.html',
  //   },
  // ]);

  // 配置自定义Icon 处理svg
  // config.module.rule('svg')
  //     .test(/\.svg(\?v=\d+\.\d+\.\d+)?$/i)
  //     .use('babel-loader')
  //     .loader(require.resolve('@svgr/webpack'));

  // svg-sprite-loaders另外一种处理svg的方式
  // config.module.rule('svg')
  //     .test(/\.svg$/i)
  //     .use('svg-sprite-loader')
  //     .loader(require.resolve('svg-sprite-loader'));

  //配置alias
  config.resolve.alias.set('pages', path.resolve(__dirname, "../src/pages"));
  config.resolve.alias.set('components', path.resolve(__dirname, "../src/components"));
  config.resolve.alias.set('models', path.resolve(__dirname, "../src/models"));
  config.resolve.alias.set('services', path.resolve(__dirname, "../src/services"));
  config.resolve.alias.set('assets', path.resolve(__dirname, "../src/assets"));
  config.resolve.alias.set('utils', path.resolve(__dirname, "../src/utils"));

};
