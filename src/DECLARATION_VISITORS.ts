import Error from '.Error';
import freeze from '.Object.freeze';
import Null from '.null';

import { scope_add, root, notModule, globals_add } from './scope';

const isVarScope = (type :string) :boolean =>
	type==='FunctionDeclaration'
	||
	type==='FunctionExpression'
	||
	type==='ArrowFunctionExpression'
	||
	type==='StaticBlock'
;

const isLetScope = (type :string) :boolean =>
	type==='BlockStatement'
	||
	isVarScope(type);

const Pattern = (node :Pattern, scope :Node | null) :void => {
	switch ( node.type ) {
		
		case 'Identifier':
			scope ? scope_add(scope, node) : globals_add(node, node.name);
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

const ImportSpecifier_ImportDefaultSpecifier_ImportNamespaceSpecifier = ({ local } :Import$Specifier, parents :readonly Node[]) :void => {
	scope_add(parents[0]!, local);
};
export default /*#__PURE__*/freeze(Null({
	
	ImportSpecifier: ImportSpecifier_ImportDefaultSpecifier_ImportNamespaceSpecifier,
	ImportDefaultSpecifier: ImportSpecifier_ImportDefaultSpecifier_ImportNamespaceSpecifier,
	ImportNamespaceSpecifier: ImportSpecifier_ImportDefaultSpecifier_ImportNamespaceSpecifier,
	
	VariableDeclaration: (node :VariableDeclaration, parents :readonly Node[]) :void => {
		const isScope = node.kind==='var' ? isVarScope : isLetScope;
		const { declarations } = node;
		const { length } = declarations;
		let index :number = parents.length;
		while ( index>1 ) {
			const parent = parents[--index]!;
			if ( isScope(parent.type) ) {
				index = 0;
				while ( index<length ) { Pattern(declarations[index++]!.id, parent); }
				return;
			}
		}
		index = 0;
		while ( index<length ) { Pattern(declarations[index++]!.id, notModule ? null : root); }
	},
	
	Function: (scope :Function$) :void => {
		let index :number = 0;
		for ( const { params } = scope, { length } = params; index<length; ++index ) { Pattern(params[index]!, scope); }
		const { id } = scope;
		id && scope_add(scope, id);
	},
	
	FunctionDeclaration: (node :Function$, parents :readonly Node[]) :void => {
		const { id } = node;
		if ( id ) {
			let index :number = parents.length - 2;
			while ( index>0 ) {
				const parent = parents[index--]!;
				if ( isLetScope(parent.type) ) {
					scope_add(parent, id);
					if ( notModule && parent.type==='BlockStatement' ) {
						while ( index ) {
							if ( isVarScope(parents[index--]!.type) ) { return; }
						}
						globals_add(id, id.name);
					}
					return;
				}
			}
			notModule ? globals_add(id, id.name) : scope_add(root, id);
		}
	},
	
	Class: (scope :Class$) :void => {
		const { id } = scope;
		id && scope_add(scope, id);
	},
	
	ClassDeclaration: (node :Class$, parents :readonly Node[]) :void => {
		const { id } = node;
		if ( id ) {
			let index :number = parents.length - 2;
			while ( index>0 ) {
				const parent = parents[index--]!;
				if ( isLetScope(parent.type) ) {
					scope_add(parent, id);
					return;
				}
			}
			notModule ? globals_add(id, id.name) : scope_add(root, id);
		}
	},
	
	TryStatement: ({ handler } :TryStatement) :void => {
		if ( handler ) {
			const { param } = handler;
			param && Pattern(param, handler);
		}
	},
	
}));

type Pattern = import('./Node').Pattern;
type Import$Specifier = import('./Node').Import$Specifier;

import type { Node, Function$, Class$, VariableDeclaration, TryStatement } from './Node';