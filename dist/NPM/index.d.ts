export = exports;
declare const exports :typeof findGlobals & Readonly<{
	version :'1.0.1',
	default :typeof exports,
}>;
declare function findGlobals<Node extends object> (ast :Readonly<Node>) :Map<string, Node[]> & { names () :string[], nodes () :Node[] };