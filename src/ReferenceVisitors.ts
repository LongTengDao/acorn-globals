import create from '.Object.create';
import assign from '.Object.assign';

import { scope_has } from './scope';

const isFunction = ({ type } :Node) :boolean => type==='FunctionExpression' || type==='FunctionDeclaration';

export default function ReferenceVisitors (globals :{ add (node :Node) :void }) {
	
	function Identifier (node :Identifier, parents :Node[]) :void {
		const { name } = node;
		const { length } = parents;
		let index :number = 0;
		if ( name==='arguments' ) {
			for ( ; index<length; ++index ) {
				const parent = parents[index];
				if ( scope_has(parent, name) || isFunction(parent) ) { return; }
			}
		}
		else {
			for ( ; index<length; ++index ) {
				const parent = parents[index];
				if ( scope_has(parent, name) ) { return; }
			}
		}
		globals.add(node);
	}
	
	return assign(create(null), {
		Identifier,// Identifier (reference)
		VariablePattern: Identifier,// Identifier (definition)
		ThisExpression (node :ThisExpression, parents :Node[]) :void {
			if ( parents.some(isFunction) ) { return; }
			globals.add(node);
		},
	});
	
};

type Node = import('./Node').Node;
type Identifier = import('./Node').Identifier;
type ThisExpression = import('./Node').ThisExpression;