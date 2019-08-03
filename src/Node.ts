import WeakMap from '.WeakMap';
import Error from '.Error';
import Set from '.Set';

const NODE_NAMES :WeakMap<Node, Set<string>> = new WeakMap;
let node_names :WeakMap<Node, Set<string>> = NODE_NAMES;

export function scope_new () :void {
	if ( node_names!==NODE_NAMES  ) { throw Error(`Can't start new finding before previous finding finished.`); }
	node_names = new WeakMap;
}

export function scope_add (node :Node, { name } :Node) :void {
	let names :Set<string> | undefined = node_names.get(node);
	if ( !names ) { node_names.set(node, names = new Set); }
	names.add(name);
}

export function scope_has (node :Node, name :string) :boolean {
	const names :Set<string> | undefined = node_names.get(node);
	return names ? names.has(name) : false;
}

export function scope_old () :void {
	node_names = NODE_NAMES;
}

export var Node :never;
export type Node = object & {
	
	name :string
	kind :string
	type :string
	start :number
	end :number
	
	id :Node
	left :Node
	value :Node | null
	local :Node
	param :Node
	handler :Node | null
	argument :Node
	
	params :Node[]
	elements :( Node | null )[]
	properties :Node[]
	declarations :Node[]
	
};
