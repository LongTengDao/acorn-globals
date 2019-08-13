type ReadonlyObject<O> = object & Readonly<O>;

export type Node = ReadonlyObject<{
	type :string,
}>;

export type ThisExpression = ReadonlyObject<{
	type :'ThisExpression',
}>;

export type Identifier = ReadonlyObject<{
	type :'Identifier',
	name :string,
}>;

export type ObjectPattern = ReadonlyObject<{
	type :'ObjectPattern',
	properties :ReadonlyArray<ReadonlyObject<{ value :Pattern, argument? :never } | { value? :never, argument :Pattern }>>,
}>;

export type ArrayPattern = ReadonlyObject<{
	type :'ArrayPattern',
	elements :ReadonlyArray<Pattern | null>,
}>;

export type RestElement = ReadonlyObject<{
	type :'RestElement',
	argument :Pattern,
}>;

export type AssignmentPattern = ReadonlyObject<{
	type :'AssignmentPattern',
	left :Pattern,
}>;

export type Pattern = Identifier | ObjectPattern | ArrayPattern | RestElement | AssignmentPattern | ReadonlyObject<{ type :'' }>;

export type Function$ = ReadonlyObject<{
	type :'FunctionDeclaration' | 'Function',
	id :Identifier | null,
	params :ReadonlyArray<Pattern>,
}>;

export type Class$ = ReadonlyObject<{
	type :'ClassDeclaration' | 'Class',
	id :Identifier | null,
}>;

export type VariableDeclaration = ReadonlyObject<{
	type :'VariableDeclaration',
	kind :'var' | 'let' | 'const',
	declarations :ReadonlyArray<Node & ReadonlyObject<{ id :Pattern }>>,
}>;

export type TryStatement = ReadonlyObject<{
	type :'TryStatement',
	handler :Node & ReadonlyObject<{ param :Pattern }> | null,
}>;

export type Import$Specifier = ReadonlyObject<{
	type :'ImportSpecifier' | 'ImportDefaultSpecifier' | 'ImportNamespaceSpecifier',
	local :Identifier,
}>;

export type FieldDefinition = ReadonlyObject<{
	type :'FieldDefinition',
	computed :boolean,
	key :Node,
	value :Node | null,
}>;
