/**
 * Created by B on 2017/7/14.
 */
const Prism = require('prismjs');
// 添加支持的语言
require('prismjs/components/prism-ruby.min');
require('prismjs/components/prism-php.min');
// 添加插件
require('prismjs/plugins/toolbar/prism-toolbar.min');
require('prismjs/plugins/toolbar/prism-toolbar.css');
require('prismjs/plugins/line-numbers/prism-line-numbers.min');
require('prismjs/plugins/line-numbers/prism-line-numbers.css');
require('prismjs/plugins/previewer-base/prism-previewer-base.min');
require('prismjs/plugins/previewer-base/prism-previewer-base.css');
require('prismjs/plugins/previewer-color/prism-previewer-color.min');
require('prismjs/plugins/previewer-color/prism-previewer-color.css');
require('prismjs/plugins/previewer-gradient/prism-previewer-gradient.min');
require('prismjs/plugins/previewer-gradient/prism-previewer-gradient.css');
// 设置主题
import 'prismjs/themes/prism-okaidia.css'

module.exports = {
  Prism,
};
