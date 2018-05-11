const { resolve, dirname } = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');

class SplitHtmlWebpackPlugin {
  constructor(options) {

  }

  apply(compiler) {
    /**
     * Webpack: 4
     */
    if (compiler.hooks) {
      compiler.hooks.compilation.tap('SplitHtmlWebpackPlugin', (compilation) => {
        compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
          'SplitHtmlWebpackPlugin',
          (data, cb) => {
            this.splitHtml(compilation, data, cb);
          }
        );
      });
    }
  }

  writeAssetToDisk(compilation, filename, content) {
    // Prepare folders
    const fullPath = resolve(compilation.compiler.outputPath, filename);
    const directory = dirname(fullPath);

    mkdirp(directory, err => {
      if (err) return cb(err);
      //Write disk
      fs.writeFile(fullPath, content.toString(), err => {
        if (err) return cb(err);
      });
    });
  }

  splitHtml(compilation, htmlWebpackPluginData, cb) {
    const contents = htmlWebpackPluginData.html.toString();
    const stop = 'stop';
    const regex = /\s*<!--\s*split\s+(\S+)\s*-->\s*/g;
    let result;
    const splits = [];

    while (result = regex.exec(contents)) {
      splits.push({ name: result[1], start: result.index + result[0].length });
      if (splits.length > 1) {
        splits[splits.length - 2].end = result.index;
      }
    }
    if (splits.length > 0) {
      splits[splits.length - 1].end = contents.length - 1;
    }

    // check for file without splits
    if (splits.length == 0) {
      cb(null, htmlWebpackPluginData);
    }
    // create a new Vinyl file for each split with content in it
    splits.forEach(split => {
      const newContents = contents.substr(split.start, split.end - split.start);
      if (newContents.length > 0 && split.name != stop) {
        // console.log(newContents.toString());
        // console.log('\n\n\n\n\n\n\n\n\n\n');
        this.writeAssetToDisk(compilation, split.name , newContents.toString());
      }
    });

    // Clean comments before emit
    htmlWebpackPluginData = this.cleanDataBeforeEmit(htmlWebpackPluginData);
    cb(null, htmlWebpackPluginData);
  }

  cleanDataBeforeEmit(htmlWebpackPluginData) {
    htmlWebpackPluginData.html = htmlWebpackPluginData.html.replace(/(\<{1}\!{1}\-{2})(\s)+(split){1}(\s)+.*(\s)+(\-{2}\>{1})/ig, '');
    return htmlWebpackPluginData;
  }
}

module.exports = SplitHtmlWebpackPlugin;
