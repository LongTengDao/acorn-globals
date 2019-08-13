import WeakMap from '.WeakMap';
import Error from '.Error';
import Set from '.Set';

const NODE_NAMES :WeakMap<Node, Set<string>> = new WeakMap;
let node_names :WeakMap<Node, Set<string>> = NODE_NAMES;

export function scope_new () :void {
	if ( node_names!==NODE_NAMES  ) { throw Error(`Can't start new finding before previous finding finished.`); }
	node_names = new WeakMap;
}

export function scope_add (scope :Node, { name } :Identifier) :void {
	let names :Set<string> | undefined = node_names.get(scope);
	if ( !names ) { node_names.set(scope, names = new Set); }
	names.add(name);
}

export function scope_has (scope :Node, name :string) :boolean {
	const names :Set<string> | undefined = node_names.get(scope);
	return names ? names.has(name) : false;
}

export function scope_old () :void {
	node_names = NODE_NAMES;
}

type Node = import('./Node').Node;
type Identifier = import('./Node').Identifier;