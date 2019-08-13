export = exports;
declare const exports :typeof findGlobals & Readonly<{
	version :'1.0.2',
	default :typeof exports,
}>;

declare function findGlobals (AST :object) :Globals;

declare interface Globals extends Map<string, ( Identifier | ThisExpression )[]> {
	names (this :Globals) :string[]
	nodes (this :Globals) :( Identifier | ThisExpression )[]
}

type Identifier = {
	type :'Identifier',
	start :number,
	end :number,
	name :string,
};

type ThisExpression = {
	type :'ThisExpression',
	start :number,
	end :number,
};
