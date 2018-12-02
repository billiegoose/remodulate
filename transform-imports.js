module.exports = function(file, api) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.ImportDeclaration)
    .replaceWith(p => {
      // import * as Foo from "./foo"
      if (p.value.specifiers.length === 1 && p.value.specifiers[0].type === "ImportNamespaceSpecifier") {
        // const Foo = require("./foo")
        return j.variableDeclaration("const", [
          j.variableDeclarator(
            j.identifier(p.value.specifiers[0].local.name),
            j.callExpression(j.identifier("require"), [j.literal(p.value.source.value)])
          )
        ]);
      }

      // import Foo from "./foo"
      // import { foo, bar as baz } from "./foo"
      // import Abc, { foo, bar as baz } from "./foo"
      let props = [];
      for (let specifier of p.value.specifiers) {
        const local = specifier.local.name;
        const imported = specifier.type === 'ImportDefaultSpecifier'
          ? 'default'
          : specifier.imported.name;

        let prop = j.property("init", j.identifier(imported), j.identifier(local));
        if (imported === local) prop.shorthand = true;
        props.push(prop);
      }
      if (props.length > 0) {
        return j.variableDeclaration("const", [
          j.variableDeclarator(
            j.objectPattern(props),
            j.callExpression(j.identifier("require"), [j.literal(p.value.source.value)])
          )
        ]);
      }
      return p.value;
    })
    .toSource();
};
