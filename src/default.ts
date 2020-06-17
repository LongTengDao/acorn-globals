import version from './version?text';

import Map from '.Map';
import push from '.Array.prototype.push';
import apply from '.Reflect.apply';

import { scope_new, scope_low, scope_old } from './scope';
import DECLARATION_VISITORS from './DECLARATION_VISITORS';
import ReferenceVisitors from './ReferenceVisitors';

const { ancestor, base } :typeof import('acorn-walk') & { base :any } = require('acorn-walk');

base.FieldDefinition ?? ( base.FieldDefinition = (
	node :Readonly<FieldDefinition>,
	state_or_parents :Readonly<any | Node[]>,
	_continue :(
		node :Readonly<Node>,
		state :Readonly<any | Node[]>,
		override :string
	) => void
) :void => {
	node.computed && _continue(node.key, state_or_parents, 'Expression');
	const { value } = node;
	value && _continue(value, state_or_parents, 'Expression');
} );

class Globals extends Map<string, ( Identifier | ThisExpression )[]> {
	names (this :Globals) :string[] {
		return [ ...this.keys() ];
	}
	nodes (this :Globals) {
		const nodes :( Identifier | ThisExpression )[] = [];
		for ( const value of this.values() ) { apply(push, nodes, value); }
		return nodes;
	}
}

const findGlobals = (AST :Node & { sourceType? :'module' | 'script' }) :Globals => {
	scope_new();
	try {
		const globals :Globals = new Globals;
		ancestor(AST, DECLARATION_VISITORS);
		ancestor(AST, ReferenceVisitors(globals));
		AST.type==='Program' && AST.sourceType!=='module' && scope_low(AST, globals);
		return globals;
	}
	finally { scope_old(); }
};

import Default from '.default';
export default Default(findGlobals, { version });

import type { Node, FieldDefinition, Identifier, ThisExpression } from './Node';