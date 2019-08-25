import version from './version?text';

import Map from '.Map';
import push from '.Array.prototype.push';
import apply from '.Reflect.apply';

import { scope_new, scope_low, scope_old } from './scope';
import DECLARATION_VISITORS from './DECLARATION_VISITORS';
import ReferenceVisitors from './ReferenceVisitors';

const { ancestor, base } = require('acorn-walk');

if ( !base.FieldDefinition ) {
	base.FieldDefinition = function (node :Readonly<FieldDefinition>, state_parents :Readonly<any | Node[]>, _continue :(node :Readonly<Node>, state :Readonly<any | Node[]>, override :string) => void) :void {
		if ( node.computed ) { _continue(node.key, state_parents, 'Expression'); }
		const { value } = node;
		if ( value ) { _continue(value, state_parents, 'Expression'); }
	};
}

class Globals extends Map<string, ( Identifier | ThisExpression )[]> {
	names (this :Globals) :string[] {
		return [ ...this.keys() ];
	}
	nodes (this :Globals) {
		const nodes :( Identifier | ThisExpression )[] = [];
		for ( const value of this.values() ) {
			apply(push, nodes, value);
		}
		return nodes;
	}
}

function findGlobals (AST :Node & { sourceType? :'module' | 'script' }) :Globals {
	scope_new();
	try {
		const globals :Globals = new Globals;
		ancestor(AST, DECLARATION_VISITORS);
		ancestor(AST, ReferenceVisitors(globals));
		if ( AST.type==='Program' && AST.sourceType!=='module' ) { scope_low(AST, globals); }
		return globals;
	}
	finally { scope_old(); }
}

import Default from '.default';
export default Default(findGlobals, { version });

type Node = import('./Node').Node;
type FieldDefinition = import('./Node').FieldDefinition;
type Identifier = import('./Node').Identifier;
type ThisExpression = import('./Node').ThisExpression;