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

function Pattern (node :Pattern, scope :Node) :void {
	switch ( node.type ) {
		
		case 'Identifier':
			scope_add(scope, node);
			break;
		
		case 'ObjectPattern':// { Pattern }
			for ( let { properties } = node, { length } = properties, index :number = 0; index<length; ++index ) {
				const property = properties[index];
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
		
		case 'ArrayPattern':// [ , Pattern ]
			for ( let { elements } = node, { length } = elements, index :number = 0; index<length; ++index ) {
				const element = elements[index];
				if ( element ) { Pattern(element, scope); }
			}
			break;
		
		case 'RestElement':// [ ...argumentPattern ] (...argumentPattern)
			Pattern(node.argument, scope);
			break;
		
		case 'AssignmentPattern':// leftPattern = right
			Pattern(node.left, scope);
			break;
		
		default:
			throw Error(`Unrecognized pattern type: ${node.type}`);
			
	}
}

function VariableDeclaration (node :VariableDeclaration, parents :readonly Node[]) :void {
	const isScope = node.kind==='var' ? isVarScope : isAnyScope;
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
}

function FunctionDeclaration (node :Function$, parents :readonly Node[]) :void {
	const { id } = node;
	if ( id ) {
		for ( let index :number = parents.length-2; index>=0; --index ) {
			const parent = parents[index];
			if ( isVarScope(parent.type) ) {
				scope_add(parent, id);
				break;
			}
		}
	}
	Function(node);
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

function ClassDeclaration (node :Class$, parents :readonly Node[]) :void {
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
}

function Class (scope :Class$) :void {
	const { id } = scope;
	if ( id ) { scope_add(scope, id); }
}

function TryStatement ({ handler } :TryStatement) :void {
	if ( handler ) { Pattern(handler.param, handler); }
}

function Import$Specifier ({ local } :Import$Specifier, parents :readonly Node[]) :void {
	scope_add(parents[0], local);
}

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

type Node = import('./Node').Node;

type Pattern = import('./Node').Pattern;

type Function$ = import('./Node').Function$;

type Class$ = import('./Node').Class$;

type VariableDeclaration = import('./Node').VariableDeclaration;

type TryStatement = import('./Node').TryStatement;

type Import$Specifier = import('./Node').Import$Specifier;
