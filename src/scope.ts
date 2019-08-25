import WeakMap from '.WeakMap';
import Error from '.Error';
import Set from '.Set';

const SCOPE_NAMES :WeakMap<Node, Set<string>> = new WeakMap;

let scope_names :WeakMap<Node, Set<string>> = SCOPE_NAMES;

export function scope_new () :void {
	if ( scope_names!==SCOPE_NAMES  ) { throw Error(`Can't start new finding before previous finding finished.`); }
	scope_names = new WeakMap;
}

export function scope_add (scope :Node, { name } :Identifier) :void {
	let names = scope_names.get(scope);
	if ( !names ) { scope_names.set(scope, names = new Set); }
	names.add(name);
}

export function scope_has (scope :Node, name :string) :boolean {
	const names = scope_names.get(scope);
	return names ? names.has(name) : false;
}

export function scope_low (scope :Node, globals :Map<string, ( Identifier | ThisExpression )[]>) :void {
	const names = scope_names.get(scope);
	if ( names ) {
		for ( const name of names ) {
			globals.set(name, []);
		}
	}
}

export function scope_old () :void {
	scope_names = SCOPE_NAMES;
}

type Node = import('./Node').Node;
type Identifier = import('./Node').Identifier;
type ThisExpression = import('./Node').ThisExpression;