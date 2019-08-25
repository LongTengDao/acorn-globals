import Null from '.null';

import { scope_has } from './scope';

const isAutoScope = (type :string) :boolean =>
	type==='FunctionExpression' ||
	type==='FunctionDeclaration';

export default function ReferenceVisitors (globals :Map<string, ( Identifier | ThisExpression )[]>) {
	
	function Identifier (node :Identifier, parents :readonly Node[]) :void {
		const { name } = node;
		let index :number = parents.length;
		if ( name==='arguments' ) {
			while ( index ) {
				const parent = parents[--index];
				if ( scope_has(parent, name) || isAutoScope(parent.type) ) { return; }
			}
		}
		else {
			while ( index ) {
				if ( scope_has(parents[--index], name) ) { return; }
			}
		}
		add(globals, node, name);
	}
	
	function ThisExpression (node :ThisExpression, parents :readonly Node[]) :void {
		for ( let index :number = parents.length; index; ) {
			if ( isAutoScope(parents[--index].type) ) { return; }
		}
		add(globals, node, 'this');
	}
	
	return Null({
		Identifier,// reference
		VariablePattern: Identifier,// definition
		ThisExpression,
	});
	
};

function add (globals :Map<string, ( Identifier | ThisExpression )[]>, node :Identifier | ThisExpression, name :string) :void {
	const nodes = globals.get(name);
	if ( nodes ) { nodes.push(node); }
	else { globals.set(name, [ node ]); }
}

type Node = import('./Node').Node;

type Identifier = import('./Node').Identifier;

type ThisExpression = import('./Node').ThisExpression;
