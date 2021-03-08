import Null from '.null';

import { scope_has } from './scope';

const add = (globals :Map<string, ( Identifier | ThisExpression )[]>, node :Identifier | ThisExpression, name :string) :void => {
	const nodes = globals.get(name);
	nodes
		? nodes[nodes.length] = node
		: globals.set(name, [ node ]);
};

export default (globals :Map<string, ( Identifier | ThisExpression )[]>) => {
	
	const Identifier = (node :Identifier, parents :readonly Node[]) :void => {
		const { name } = node;
		let index :number = parents.length;
		if ( name==='arguments' ) {
			while ( index ) {
				const parent = parents[--index]!;
				if ( scope_has(parent, name) ) { return; }
				const { type } = parent;
				if ( type==='FunctionExpression' || type==='FunctionDeclaration' ) { return; }
			}
		}
		else {
			while ( index ) {
				if ( scope_has(parents[--index]!, name) ) { return; }
			}
		}
		add(globals, node, name);
	};
	
	const ThisExpression = (node :ThisExpression, parents :readonly Node[]) :void => {
		let index :number = parents.length;
		while ( index ) {
			const parent = parents[--index]!;
			const { type } = parent;
			if ( type==='FunctionExpression' || type==='FunctionDeclaration' || type==='PropertyDefinition' && parents[index+1]===( parent as PropertyDefinition ).value ) { return; }
		}
		add(globals, node, 'this');
	};
	
	return Null({
		Identifier,// reference
		VariablePattern: Identifier,// definition
		ThisExpression,
	});
	
};

import type { Node, Identifier, ThisExpression, PropertyDefinition } from './Node';