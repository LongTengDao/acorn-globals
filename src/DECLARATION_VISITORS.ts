import Error from '.Error';
import freeze from '.Object.freeze';
import Null from '.null';

import { scope_add } from './scope';

const isVarScope = (type :string) :boolean =>
	type==='FunctionDeclaration' ||
	type==='FunctionExpression' ||
	type==='ArrowFunctionExpression' ||
	type==='Program';

const isAnyScope = (type :string) :boolean =>
	type==='BlockStatement' ||
	isVarScope(type);

const Pattern = (node :Pattern, scope :Node) :void => {
	switch ( node.type ) {
		
		case 'Identifier':
			scope_add(scope, node);
			break;
		
		case 'ObjectPattern':{// { Pattern }
			let index :number = 0;
			for ( const { properties } = node, { length } = properties; index<length; ++index ) {
				const property = properties[index]!;
				switch ( property.type ) {
					case 'Property':// { key: valuePattern }
						Pattern(property.value, scope);
						break;
					case 'RestElement':// { ...argumentPattern }
						Pattern(property.argument, scope);
						break;
					default:
						throw Error(`Unrecognized pattern type: ${property.type}`);
				}
			}
			break;
		}
		
		case 'ArrayPattern': {// [ , Pattern ]
			let index :number = 0;
			for ( const { elements } = node, { length } = elements; index<length; ++index ) {
				const element = elements[index];
				element && Pattern(element, scope);
			}
			break;
		}
		
		case 'RestElement':// [ ...argumentPattern ] (...argumentPattern)
			Pattern(node.argument, scope);
			break;
		
		case 'AssignmentPattern':// leftPattern = right
			Pattern(node.left, scope);
			break;
		
		default:
			throw Error(`Unrecognized pattern type: ${node.type}`);
			
	}
};

const VariableDeclaration = (node :VariableDeclaration, parents :readonly Node[]) :void => {
	const isScope = node.kind==='var' ? isVarScope : isAnyScope;
	let index :number = parents.length;
	while ( index ) {
		const parent = parents[--index]!;
		if ( isScope(parent.type) ) {
			let index :number = 0;
			for ( const { declarations } = node, { length } = declarations; index<length; ++index ) { Pattern(declarations[index]!.id, parent); }
			break;
		}
	}
};

const Function = (scope :Function$) :void => {
	let index :number = 0;
	for ( const { params } = scope, { length } = params; index<length; ++index ) { Pattern(params[index]!, scope); }
	const { id } = scope;
	id && scope_add(scope, id);
};
const FunctionDeclaration = (node :Function$, parents :readonly Node[]) :void => {
	const { id } = node;
	if ( id ) {
		let index :number = parents.length - 1;
		while ( index ) {
			const parent = parents[--index]!;
			if ( isVarScope(parent.type) ) {
				scope_add(parent, id);
				break;
			}
		}
	}
	Function(node);
};

const Class = (scope :Class$) :void => {
	const { id } = scope;
	id && scope_add(scope, id);
};
const ClassDeclaration = (node :Class$, parents :readonly Node[]) :void => {
	const { id } = node;
	if ( id ) {
		let index :number = parents.length - 1;
		while ( index ) {
			const parent = parents[--index]!;
			if ( isAnyScope(parent.type) ) {
				scope_add(parent, id);
				break;
			}
		}
	}
	Class(node);
};

const TryStatement = ({ handler } :TryStatement) :void => {
	if ( handler ) {
		const { param } = handler;
		param && Pattern(param, handler);
	}
};

const Import$Specifier = ({ local } :Import$Specifier, parents :readonly Node[]) :void => {
	scope_add(parents[0]!, local);
};

export default /*#__PURE__*/freeze(Null({
	VariableDeclaration,
	FunctionDeclaration,
	Function,
	ClassDeclaration,
	Class,
	TryStatement,
	ImportSpecifier: Import$Specifier,
	ImportDefaultSpecifier: Import$Specifier,
	ImportNamespaceSpecifier: Import$Specifier,
}));


import type { Node, Function$, Class$, VariableDeclaration, TryStatement } from './Node';
type Pattern = import('./Node').Pattern;
type Import$Specifier = import('./Node').Import$Specifier;