export = exports;
declare const exports :typeof findGlobals & Readonly<{
	version :'1.8.0',
	default :typeof exports,
}>;

declare function findGlobals (AST :{ loc :{} }) :Globals<true>;
declare function findGlobals (AST :{ loc? :undefined }) :Globals<false>;
declare function findGlobals (AST :{ loc? :{} }) :Globals<boolean>;

declare interface Globals<WithLoc extends boolean> extends Map<string, Node<WithLoc>[]> {
	names (this :Globals<boolean>) :string[]
	nodes (this :Globals<WithLoc>) :Node<WithLoc>[];
}

type Node<WithLoc extends boolean> = {
	type :'Identifier' | 'ThisExpression',
	name? :string,
	start :number,
	end :number,
} & (
	WithLoc extends true ? { loc :Loc } :
		WithLoc extends false ? { loc? :undefined } :
			{ loc? :Loc }
	);

type Loc = {
	start :{
		line :Exclude<number, 0>,
		column :number,
	},
	end :{
		line :Exclude<number, 0>,
		column :number,
	},
};
