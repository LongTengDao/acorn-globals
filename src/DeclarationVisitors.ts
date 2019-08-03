import create from '.Object.create';
import assign from '.Object.assign';
import Error from '.Error';

import { scope_add, Node } from './Node';

const isBigScope = (type :string) :boolean => type==='FunctionDeclaration' || type==='FunctionExpression' || type==='ArrowFunctionExpression' || type==='Program';
const isAnyScope = (type :string) :boolean => type==='BlockStatement' || isBigScope(type);

function Pattern (node :Node, parent :Node) :void {
	switch ( node.type ) {
		case 'Identifier':
			scope_add(parent, node);
			break;
		case 'ObjectPattern': {
			const { properties } :Node = node;
			const { length } :Node[] = properties;
			for ( let index :number = 0; index<length; ++index ) {
				const property :Node = properties[index];
				Pattern(property.value || property.argument, parent);
			}
			break;
		}
		case 'ArrayPattern': {
			const { elements } :Node = node;
			const { length } :( Node | null )[] = elements;
			for ( let index :number = 0; index<length; ++index ) {
				const element :Node | null = elements[index];
				if ( element ) { Pattern(element, parent); }
			}
			break;
		}
		case 'RestElement':
			Pattern(node.argument, parent);
			break;
		case 'AssignmentPattern':
			Pattern(node.left, parent);
			break;
		default:
			throw Error(`Unrecognized pattern type: ${node.type}`);
	}
}

function Function (node :Node) :void {
	const { params } :Node = node;
	const { length } :Node[] = params;
	for ( let index :number = 0; index<length; ++index ) {
		Pattern(params[index], node);
	}
	const { id } :Node = node;
	if ( id ) { scope_add(node, id); }
}

function Class (node :Node) :void {
	const { id } :Node = node;
	if ( id ) { scope_add(node, id); }
}

const DECLARATION_VISITORS = {
	
	VariableDeclaration (node :Node, parents :Node[]) :void {
		const isScope = node.kind==='var' ? isBigScope : isAnyScope;
		for ( let index :number = parents.length-1; index>=0; --index ) {
			const parent :Node = parents[index];
			if ( isScope(parent.type) ) {
				const { declarations } :Node = node;
				const { length } :Node[] = declarations;
				for ( let index :number = 0; index<length; ++index ) {
					Pattern(declarations[index].id, parent);
				}
				break;
			}
		}
	},
	
	FunctionDeclaration (node :Node, parents :Node[]) :void {
		const { id } :Node = node;
		if ( id ) {
			for ( let index :number = parents.length-2; index>=0; --index ) {
				const parent :Node = parents[index];
				if ( isBigScope(parent.type) ) {
					scope_add(parent, id);
					break;
				}
			}
		}
		Function(node);
	},
	Function,
	
	ClassDeclaration (node :Node, parents :Node[]) :void {
		const { id } :Node = node;
		if ( id ) {
			for ( let index :number = parents.length-2; index>=0; --index ) {
				const parent :Node = parents[index];
				if ( isAnyScope(parent.type) ) {
					scope_add(parent, id);
					break;
				}
			}
		}
		Class(node);
	},
	Class,
	
	TryStatement ({ handler } :Node) :void {
		if ( handler ) { scope_add(handler, handler.param); }
	},
	
};

export default function DeclarationVisitors (ast :Node) {
	function Import (node :Node) :void { scope_add(ast, node.local); }
	return assign(create(null), DECLARATION_VISITORS, {
		ImportSpecifier: Import,
		ImportDefaultSpecifier: Import,
		ImportNamespaceSpecifier: Import,
	});
};
