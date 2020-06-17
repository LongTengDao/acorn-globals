type ReadonlyObject<O> = object & Readonly<O>;

export type Node = ReadonlyObject<{
	type :string
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
	properties :ReadonlyArray<Property | RestElement | Unrecognized>,
}>;

export type ArrayPattern = ReadonlyObject<{
	type :'ArrayPattern',
	elements :ReadonlyArray<Pattern | null>,
}>;

export type Property = ReadonlyObject<{
	type :'Property',
	value :Pattern,
}>;

export type RestElement = ReadonlyObject<{
	type :'RestElement',
	argument :Pattern,
}>;

export type AssignmentPattern = ReadonlyObject<{
	type :'AssignmentPattern',
	left :Pattern,
}>;

export type Pattern = Identifier | ObjectPattern | ArrayPattern | RestElement | AssignmentPattern | Unrecognized;

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
	handler :Node & ReadonlyObject<{ param :Pattern | null }> | null,
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

export type ChainExpression = ReadonlyObject<{
	type :'ChainExpression',
	expression :Node,
}>;

type Unrecognized = ReadonlyObject<{
	type :'',
}>;
