import freeze from '.Object.freeze';
import Null from '.null';

import { scope_has, globals_add } from './scope';

const Identifier_VariablePattern = (node :Identifier, parents :readonly Node[]) :void => {
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
	globals_add(node, name);
};

export default /*#__PURE__*/ freeze(Null({
	Identifier: Identifier_VariablePattern,// reference
	VariablePattern: Identifier_VariablePattern,// definition
	ThisExpression: (node :ThisExpression, parents :readonly Node[]) :void => {
		let index :number = parents.length;
		while ( index ) {
			const parent = parents[--index]!;
			const { type } = parent;
			if ( type==='FunctionExpression' || type==='FunctionDeclaration' || type==='StaticBlock' || type==='PropertyDefinition' && parents[index+1]===( parent as PropertyDefinition ).value ) { return; }
		}
		globals_add(node, 'this');
	},
}));

import type { Node, Identifier, ThisExpression, PropertyDefinition } from './Node';