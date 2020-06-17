import WeakMap from '.WeakMap';
import Error from '.Error';
import Set from '.Set';

const SCOPE_NAMES :WeakMap<Node, Set<string>> = new WeakMap;

let scope_names :WeakMap<Node, Set<string>> = SCOPE_NAMES;

export const scope_new = () :void => {
	if ( scope_names!==SCOPE_NAMES  ) { throw Error(`Can't start new finding before previous finding finished.`); }
	scope_names = new WeakMap;
};

export const scope_add = (scope :Node, { name } :Identifier) :void => {
	const names = scope_names.get(scope);
	names
		? names.add(name)
		: scope_names.set(scope, new Set<string>().add(name));
};

export const scope_has = (scope :Node, name :string) :boolean => {
	const names = scope_names.get(scope);
	return names ? names.has(name) : false;
};

export const scope_low = (scope :Node, globals :Map<string, ( Identifier | ThisExpression )[]>) :void => {
	const names = scope_names.get(scope);
	if ( names ) { for ( const name of names ) { globals.set(name, []); } }
};

export const scope_old = () :void => {
	scope_names = SCOPE_NAMES;
};

import type { Node, Identifier, ThisExpression } from './Node';