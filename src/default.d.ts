export = exports;
declare const exports :typeof findGlobals & Readonly<{
	version :string,
	default :typeof exports,
}>;

declare function findGlobals<AST extends { loc? :{} }> (ast :AST) :Globals<AST extends { loc :{} } ? true : false>;

declare interface Globals<WithLoc extends boolean> extends Map<string, ( WithLoc extends true ? NodeWithLoc : NodeWithoutLoc )[]> {
	names (this :Globals<boolean>) :string[]
	nodes (this :Globals<true>) :NodeWithLoc[]
	nodes (this :Globals<false>) :NodeWithoutLoc[]
}

type NodeWithoutLoc = {
	type :'Identifier' | 'ThisExpression',
	name? :string,
	start :number,
	end :number,
	loc? :undefined,
};

type NodeWithLoc = {
	type :'Identifier' | 'ThisExpression',
	name? :string,
	start :number,
	end :number,
	loc :{
		start :{
			line :Exclude<number, 0>,
			column :number,
		},
		end :{
			line :Exclude<number, 0>,
			column :number,
		},
	},
};
