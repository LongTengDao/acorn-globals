import WeakMap from '.WeakMap';
import Error from '.Error';
import Set from '.Set';

import Globals from './Globals';

const SCOPE_NAMES :WeakMap<Node, Set<string>> = new WeakMap;
const GLOBALS = new Globals;
const ROOT = { type: 'Program' };
let scope_names :WeakMap<Node, Set<string>> = SCOPE_NAMES;
export let globals :Globals = GLOBALS;
export let root :Node = ROOT;
export let notModule :boolean = false;

export const scope_new = (AST :Node & { readonly sourceType? :'module' | 'script' }) :void => {
	if ( scope_names!==SCOPE_NAMES  ) { throw Error(`Can't start new finding before previous finding finished.`); }
	scope_names = new WeakMap;
	globals = new Globals;
	root = AST;
	notModule = AST.sourceType!=='module' || AST.type!=='Program';
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

export const globals_add = (node :Identifier | ThisExpression, name :string) :void => {
	const nodes = globals.get(name);
	nodes
		? nodes[nodes.length] = node
		: globals.set(name, [ node ]);
};

export const scope_old = () :void => {
	scope_names = SCOPE_NAMES;
	globals = GLOBALS;
	root = ROOT;
};

import type { Node, Identifier, ThisExpression } from './Node';