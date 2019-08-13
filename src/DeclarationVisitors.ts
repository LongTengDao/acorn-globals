import create from '.Object.create';
import assign from '.Object.assign';
import Error from '.Error';

import { scope_add } from './scope';

const isBigScope = (type :string) :boolean => type==='FunctionDeclaration' || type==='FunctionExpression' || type==='ArrowFunctionExpression' || type==='Program';
const isAnyScope = (type :string) :boolean => type==='BlockStatement' || isBigScope(type);

function Pattern (node :Pattern, scope :Node) :void {
	switch ( node.type ) {
		case 'Identifier':
			scope_add(scope, node);
			break;
		case 'ObjectPattern': {
			const { properties } = node;
			const { length } = properties;
			for ( let index :number = 0; index<length; ++index ) {
				const property = properties[index];
				Pattern(property.value || property.argument, scope);
			}
			break;
		}
		case 'ArrayPattern': {
			const { elements } = node;
			const { length } = elements;
			for ( let index :number = 0; index<length; ++index ) {
				const element = elements[index];
				if ( element ) { Pattern(element, scope); }
			}
			break;
		}
		case 'RestElement':
			Pattern(node.argument, scope);
			break;
		case 'AssignmentPattern':
			Pattern(node.left, scope);
			break;
		default:
			throw Error(`Unrecognized pattern type: ${node.type}`);
	}
}

function Function (scope :Function$) :void {
	const { params } = scope;
	const { length } = params;
	for ( let index :number = 0; index<length; ++index ) {
		Pattern(params[index], scope);
	}
	const { id } = scope;
	if ( id ) { scope_add(scope, id); }
}

function Class (scope :Class$) :void {
	const { id } = scope;
	if ( id ) { scope_add(scope, id); }
}

const DECLARATION_VISITORS = {
	
	VariableDeclaration (node :VariableDeclaration, parents :Node[]) :void {
		const isScope = node.kind==='var' ? isBigScope : isAnyScope;
		for ( let index :number = parents.length-1; index>=0; --index ) {
			const parent = parents[index];
			if ( isScope(parent.type) ) {
				const { declarations } = node;
				const { length } = declarations;
				for ( let index :number = 0; index<length; ++index ) {
					Pattern(declarations[index].id, parent);
				}
				break;
			}
		}
	},
	
	FunctionDeclaration (node :Function$, parents :Node[]) :void {
		const { id } = node;
		if ( id ) {
			for ( let index :number = parents.length-2; index>=0; --index ) {
				const parent = parents[index];
				if ( isBigScope(parent.type) ) {
					scope_add(parent, id);
					break;
				}
			}
		}
		Function(node);
	},
	Function,
	
	ClassDeclaration (node :Class$, parents :Node[]) :void {
		const { id } = node;
		if ( id ) {
			for ( let index :number = parents.length-2; index>=0; --index ) {
				const parent = parents[index];
				if ( isAnyScope(parent.type) ) {
					scope_add(parent, id);
					break;
				}
			}
		}
		Class(node);
	},
	Class,
	
	TryStatement ({ handler } :TryStatement) :void {
		if ( handler ) { Pattern(handler.param, handler); }
	},
	
};

export default function DeclarationVisitors (ast :Node) {
	function Import (node :Import$Specifier) :void { scope_add(ast, node.local); }
	return assign(create(null), DECLARATION_VISITORS, {
		ImportSpecifier: Import,
		ImportDefaultSpecifier: Import,
		ImportNamespaceSpecifier: Import,
	});
};

type Node = import('./Node').Node;
type Pattern = import('./Node').Pattern;
type Function$ = import('./Node').Function$;
type Class$ = import('./Node').Class$;
type VariableDeclaration = import('./Node').VariableDeclaration;
type TryStatement = import('./Node').TryStatement;
type Import$Specifier = import('./Node').Import$Specifier;