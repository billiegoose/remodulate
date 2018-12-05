function createObjectPattern(j, obj) {
  const props = Object.entries(obj).map(([imported, local]) =>
    Object.assign(
      j.property("init", j.identifier(imported), j.identifier(local)),
      { shorthand: imported === local }
    )
  );
  return j.objectPattern(props);
}

function createCJSImport(j, identifier, moduleNameString) {
  let declaration = typeof identifier === 'object'
    ? createObjectPattern(j, identifier)
    : j.identifier(identifier);
  return j.variableDeclaration("const", [
    j.variableDeclarator(
      declaration,
      j.callExpression(j.identifier("require"), [j.literal(moduleNameString)])
    )
  ])
}

module.exports = function(file, api) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.ImportDeclaration)
    .replaceWith(({ value }) => {
      // import * as Foo from "./foo"
      if (value.specifiers.length === 1 && value.specifiers[0].type === "ImportNamespaceSpecifier") {
        // const Foo = require("./foo")
        return createCJSImport(j, value.specifiers[0].local.name, value.source.value);
      }

      // import Foo from "./foo"
      // import { foo, bar as baz } from "./foo"
      // import Abc, { foo, bar as baz } from "./foo"
      if (value.specifiers.length > 0) {
        let props = {};
        for (let specifier of value.specifiers) {
          const local = specifier.local.name;
          const imported = specifier.type === 'ImportDefaultSpecifier'
            ? 'default'
            : specifier.imported.name;
          props[imported] = local
        }
        return createCJSImport(j, props, value.source.value);
      }
      return value;
    })
    .toSource();
};
