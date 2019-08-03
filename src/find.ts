import Map from '.Map';
import push from '.Array.prototype.push';

import { scope_new, scope_old, Node } from './Node';
import DeclarationVisitors from './DeclarationVisitors';
import ReferenceVisitors from './ReferenceVisitors';

const { ancestor, base } = require('acorn-walk');
if ( !base.FieldDefinition ) {
	base.FieldDefinition = function (node :any, st :any, c :any) :void {
		if ( node.computed ) { c(node.key, st, 'Expression'); }
		const { value } :Node = node;
		if ( value ) { c(value, st, 'Expression'); }
	};
}

class Globals extends Map<string, Node[]> {
	add (node :Node) :void {
		const name :string = node.type==='ThisExpression' ? 'this' : node.name;
		const nodes :Node[] | undefined = this.get(name);
		if ( nodes ) { nodes.push(node); }
		else { this.set(name, [ node ]); }
	}
	names () :string[] {
		return [ ...this.keys() ];
	}
	nodes () :Node[] {
		const nodes :Node[] = [];
		for ( const value of this.values() ) {
			push.apply(nodes, value);
		}
		return nodes;
	}
}

export default function find (ast :Readonly<Node>) :Globals {
	scope_new();
	try {
		const globals :Globals = new Globals;
		ancestor(ast, DeclarationVisitors(ast));
		ancestor(ast, ReferenceVisitors(globals));
		return globals;
	}
	finally { scope_old(); }
};
