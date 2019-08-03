export = exports;
declare const exports :typeof findGlobals & Readonly<{
	version :string
	default :typeof exports
}>;
declare function findGlobals<Node extends object> (ast :Readonly<Node>) :Map<string, Node[]> & { names () :string[], nodes () :Node[] };