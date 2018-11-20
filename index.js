// Thanks stevecooperorg
// https://github.com/facebook/jscodeshift/issues/148#issuecomment-282026897

const transformExports = require("./transform-exports.js");
const transformImports = require("./transform-imports.js");

module.exports = function(file, api, options) {
  const fixes = [transformExports, transformImports];
  let src = file.source;
  fixes.forEach(fix => {
    if (typeof src === "undefined") return;
    src = fix({ ...file, source: src }, api, options);
  });
  return src;
};
