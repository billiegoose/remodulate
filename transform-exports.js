function createCJSExport(j, identifierLocal, identifierExport = identifierLocal) {
  return j.expressionStatement(
    j.assignmentExpression(
      "=",
      j.memberExpression(
        j.memberExpression(j.identifier("module"), j.identifier("exports")),
        identifierExport,
      ),
      identifierLocal,
    ),
  );
}

module.exports = function(file, api) {
  const j = api.jscodeshift;

  const root = j(file.source);

  root
    .find(j.ExportDefaultDeclaration)
    .replaceWith(({ value }) => createCJSExport(j, value.declaration, j.identifier('default')));

  root
    .find(j.ExportNamedDeclaration)
    .replaceWith(({ value }) => {
      const { declaration, specifiers } = value;

      if (specifiers.length > 0) {
        const decs = specifiers.map(
          specifier => createCJSExport(j, specifier.local, specifier.exported)
        )
        return [declaration, ...decs];
      }

      if (declaration.type === "FunctionDeclaration") {
        return [declaration, createCJSExport(j, declaration.id)];
      }

      if (declaration.type === "VariableDeclaration") {
        const decs = declaration.declarations.map(
          dec => createCJSExport(j, dec.id)
        )
        return [declaration, ...decs];
      }

      return value;
    });

  return root.toSource();
};
