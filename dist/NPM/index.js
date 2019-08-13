'use strict';

const version = '1.0.2';

const push = Array.prototype.push;

const apply = Reflect.apply;

const NODE_NAMES                             = new WeakMap;
let node_names                             = NODE_NAMES;

function scope_new ()       {
	if ( node_names!==NODE_NAMES  ) { throw Error(`Can't start new finding before previous finding finished.`); }
	node_names = new WeakMap;
}

function scope_add (scope      , { name }            )       {
	let names                          = node_names.get(scope);
	if ( !names ) { node_names.set(scope, names = new Set); }
	names.add(name);
}

function scope_has (scope      , name        )          {
	const names                          = node_names.get(scope);
	return names ? names.has(name) : false;
}

function scope_old ()       {
	node_names = NODE_NAMES;
}

const create = Object.create;

const assign = Object.assign;

const isBigScope = (type        )          => type==='FunctionDeclaration' || type==='FunctionExpression' || type==='ArrowFunctionExpression' || type==='Program';
const isAnyScope = (type        )          => type==='BlockStatement' || isBigScope(type);

function Pattern (node         , scope      )       {
	switch ( node.type ) {
		case 'Identifier':
			scope_add(scope, node);
			break;
		case 'ObjectPattern': {
			const { properties } = node;
			const { length } = properties;
			for ( let index         = 0; index<length; ++index ) {
				const property = properties[index];
				Pattern(property.value || property.argument, scope);
			}
			break;
		}
		case 'ArrayPattern': {
			const { elements } = node;
			const { length } = elements;
			for ( let index         = 0; index<length; ++index ) {
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

function Function (scope           )       {
	const { params } = scope;
	const { length } = params;
	for ( let index         = 0; index<length; ++index ) {
		Pattern(params[index], scope);
	}
	const { id } = scope;
	if ( id ) { scope_add(scope, id); }
}

function Class (scope        )       {
	const { id } = scope;
	if ( id ) { scope_add(scope, id); }
}

const DECLARATION_VISITORS = {
	
	VariableDeclaration (node                     , parents        )       {
		const isScope = node.kind==='var' ? isBigScope : isAnyScope;
		for ( let index         = parents.length-1; index>=0; --index ) {
			const parent = parents[index];
			if ( isScope(parent.type) ) {
				const { declarations } = node;
				const { length } = declarations;
				for ( let index         = 0; index<length; ++index ) {
					Pattern(declarations[index].id, parent);
				}
				break;
			}
		}
	},
	
	FunctionDeclaration (node           , parents        )       {
		const { id } = node;
		if ( id ) {
			for ( let index         = parents.length-2; index>=0; --index ) {
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
	
	ClassDeclaration (node        , parents        )       {
		const { id } = node;
		if ( id ) {
			for ( let index         = parents.length-2; index>=0; --index ) {
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
	
	TryStatement ({ handler }              )       {
		if ( handler ) { Pattern(handler.param, handler); }
	},
	
};

function DeclarationVisitors (ast      ) {
	function Import (node                  )       { scope_add(ast, node.local); }
	return assign(create(null), DECLARATION_VISITORS, {
		ImportSpecifier: Import,
		ImportDefaultSpecifier: Import,
		ImportNamespaceSpecifier: Import,
	});
}

const isFunction = ({ type }      )          => type==='FunctionExpression' || type==='FunctionDeclaration';

function ReferenceVisitors (globals                            ) {
	
	function Identifier (node            , parents        )       {
		const { name } = node;
		const { length } = parents;
		let index         = 0;
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
		ThisExpression (node                , parents        )       {
			if ( parents.some(isFunction) ) { return; }
			globals.add(node);
		},
	});
	
}

const hasOwnProperty = Object.prototype.hasOwnProperty;

const toStringTag = typeof Symbol!=='undefined' ? Symbol.toStringTag : undefined;

const defineProperty = Object.defineProperty;

const freeze = Object.freeze;

const seal = Object.seal;

const Default = (
	/*! j-globals: default (internal) */
	function Default (exports, addOnOrigin) {
		return /*#__PURE__*/ function Module (exports, addOnOrigin) {
			if ( !addOnOrigin ) { addOnOrigin = exports; exports = create(null); }
			if ( assign ) { assign(exports, addOnOrigin); }
			else { for ( var key in addOnOrigin ) { if ( hasOwnProperty.call(addOnOrigin, key) ) { exports[key] = addOnOrigin[key]; } } }
			exports['default'] = exports;
			typeof exports==='function' && exports.prototype && seal(exports.prototype);
			if ( toStringTag ) {
				var descriptor = create(null);
				descriptor.value = 'Module';
				defineProperty(exports, toStringTag, descriptor);
			}
			return freeze(exports);
		}(exports, addOnOrigin);
	}
	/*¡ j-globals: default (internal) */
);

const { ancestor, base } = require('acorn-walk');
if ( !base.FieldDefinition ) {
	base.FieldDefinition = function (node                 , state_parents              , _continue                                                             )       {
		if ( node.computed ) { _continue(node.key, state_parents, 'Expression'); }
		const { value } = node;
		if ( value ) { _continue(value, state_parents, 'Expression'); }
	};
}

class Globals extends Map                                            {
	add (               node                             )       {
		const name         = node.type==='ThisExpression' ? 'this' : node.name;
		const nodes = this.get(name);
		if ( nodes ) { nodes.push(node); }
		else { this.set(name, [ node ]); }
	}
	names (             )           {
		return [ ...this.keys() ];
	}
	nodes (             ) {
		const nodes                                    = [];
		for ( const value of this.values() ) {
			apply(push, nodes, value);
		}
		return nodes;
	}
}

function findGlobals (AST      )          {
	scope_new();
	try {
		const globals          = new Globals;
		ancestor(AST, DeclarationVisitors(AST));
		ancestor(AST, ReferenceVisitors(globals));
		return globals;
	}
	finally { scope_old(); }
}
const _default = Default(findGlobals, { version });

module.exports = _default;

//# sourceMappingURL=index.js.map