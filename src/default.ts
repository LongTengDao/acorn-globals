import version from './version?text';

import Map from '.Map';
import push from '.Array.prototype.push';
import apply from '.Reflect.apply';

import { scope_new, scope_old } from './scope';
import DeclarationVisitors from './DeclarationVisitors';
import ReferenceVisitors from './ReferenceVisitors';

const { ancestor, base } = require('acorn-walk');
if ( !base.FieldDefinition ) {
	base.FieldDefinition = function (node :FieldDefinition, state_parents :any | Node[], _continue :(node :Node, state :any | Node[], override :string) => void) :void {
		if ( node.computed ) { _continue(node.key, state_parents, 'Expression'); }
		const { value } = node;
		if ( value ) { _continue(value, state_parents, 'Expression'); }
	};
}

class Globals extends Map<string, ( Identifier | ThisExpression )[]> {
	add (this :Globals, node :Identifier | ThisExpression) :void {
		const name :string = node.type==='ThisExpression' ? 'this' : node.name;
		const nodes = this.get(name);
		if ( nodes ) { nodes.push(node); }
		else { this.set(name, [ node ]); }
	}
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

function findGlobals (AST :Node) :Globals {
	scope_new();
	try {
		const globals :Globals = new Globals;
		ancestor(AST, DeclarationVisitors(AST));
		ancestor(AST, ReferenceVisitors(globals));
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