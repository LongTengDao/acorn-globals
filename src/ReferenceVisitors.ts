import create from '.Object.create';
import assign from '.Object.assign';

import { scope_has } from './scope';

const isFunction = ({ type } :Node) :boolean => type==='FunctionExpression' || type==='FunctionDeclaration';

export default function ReferenceVisitors (globals :{ add (node :Node) :void }) {
	
	function Name (node :Node, parents :Node[]) :void {
		const { name } :Node = node;
		const { length } :Node[] = parents;
		let index :number = 0;
		if ( name==='arguments' ) {
			for ( ; index<length; ++index ) {
				const parent :Node = parents[index];
				if ( scope_has(parent, name) || isFunction(parent) ) { return; }
			}
		}
		else {
			for ( ; index<length; ++index ) {
				const parent :Node = parents[index];
				if ( scope_has(parent, name) ) { return; }
			}
		}
		globals.add(node);
	}
	
	return assign(create(null), {
		Identifier: Name,
		VariablePattern: Name,
		ThisExpression (node :Node, parents :Node[]) :void {
			if ( parents.some(isFunction) ) { return; }
			globals.add(node);
		},
	});
	
};

type Node = import('./default').Node;