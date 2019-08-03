import version from './version?text';

import Map from '.Map';
import push from '.Array.prototype.push';
import apply from '.Reflect.apply';

import { scope_new, scope_old } from './scope';
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
			apply(push, nodes, value);
		}
		return nodes;
	}
}

function findGlobals (ast :Readonly<Node>) :Globals {
	scope_new();
	try {
		const globals :Globals = new Globals;
		ancestor(ast, DeclarationVisitors(ast));
		ancestor(ast, ReferenceVisitors(globals));
		return globals;
	}
	finally { scope_old(); }
}

import Default from '.default';
export default Default(findGlobals, { version });

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