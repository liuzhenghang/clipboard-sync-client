const path = require('path');

module.exports = {
    entry: './lib/main.js',  // 指定入口文件
    output: {
        filename: 'clipboard-sync.js', // 输出文件的名称
        path: path.resolve(__dirname, 'build') // 输出目录的路径
    },
};
