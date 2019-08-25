'use strict';

const version = '1.3.0';

const push = Array.prototype.push;

const apply = Reflect.apply;

const SCOPE_NAMES                             = new WeakMap;

let scope_names                             = SCOPE_NAMES;

function scope_new ()       {
	if ( scope_names!==SCOPE_NAMES  ) { throw Error(`Can't start new finding before previous finding finished.`); }
	scope_names = new WeakMap;
}

function scope_add (scope      , { name }            )       {
	let names = scope_names.get(scope);
	if ( !names ) { scope_names.set(scope, names = new Set); }
	names.add(name);
}

function scope_has (scope      , name        )          {
	const names = scope_names.get(scope);
	return names ? names.has(name) : false;
}

function scope_low (scope      , globals                                                )       {
	const names = scope_names.get(scope);
	if ( names ) {
		for ( const name of names ) {
			globals.set(name, []);
		}
	}
}

function scope_old ()       {
	scope_names = SCOPE_NAMES;
}

const freeze = Object.freeze;

const hasOwnProperty = Object.prototype.hasOwnProperty;

const create = Object.create;

const NULL = (
	/*! j-globals: null.prototype (internal) */
	Object.create
		? /*#__PURE__*/ Object.preventExtensions(Object.create(null))
		: null
	/*¡ j-globals: null.prototype (internal) */
);

const Null = (
	/*! j-globals: null.constructor (internal) */
	/*#__PURE__*/ function () {
		var assign = Object.assign || function assign (target, source) {
			for ( var key in source ) {
				if ( hasOwnProperty.call(source, key) ) { target[key] = source[key]; }
			}
			return target;
		};
		var NULL$1 = function (object) {
			if ( object ) {
				return /*#__PURE__*/ assign(/*#__PURE__*/ create(NULL), object);
			}
		};
		delete NULL$1.name;
		//try { delete NULL.length; } catch (error) {}
		NULL$1.prototype = null;
		freeze(NULL$1);
		return NULL$1;
	}()
	/*¡ j-globals: null.constructor (internal) */
);

const isVarScope = (type        )          =>
	type==='FunctionDeclaration' ||
	type==='FunctionExpression' ||
	type==='ArrowFunctionExpression' ||
	type==='Program';

const isAnyScope = (type        )          =>
	type==='BlockStatement' ||
	isVarScope(type);

function Pattern (node         , scope      )       {
	switch ( node.type ) {
		
		case 'Identifier':
			scope_add(scope, node);
			break;
		
		case 'ObjectPattern':// { Pattern }
			for ( let { properties } = node, { length } = properties, index         = 0; index<length; ++index ) {
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
			for ( let { elements } = node, { length } = elements, index         = 0; index<length; ++index ) {
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

function VariableDeclaration (node                     , parents                 )       {
	const isScope = node.kind==='var' ? isVarScope : isAnyScope;
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
}

function FunctionDeclaration (node           , parents                 )       {
	const { id } = node;
	if ( id ) {
		for ( let index         = parents.length-2; index>=0; --index ) {
			const parent = parents[index];
			if ( isVarScope(parent.type) ) {
				scope_add(parent, id);
				break;
			}
		}
	}
	Function(node);
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

function ClassDeclaration (node        , parents                 )       {
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
}

function Class (scope        )       {
	const { id } = scope;
	if ( id ) { scope_add(scope, id); }
}

function TryStatement ({ handler }              )       {
	if ( handler ) { Pattern(handler.param, handler); }
}

function Import$Specifier ({ local }                  , parents                 )       {
	scope_add(parents[0], local);
}

const DECLARATION_VISITORS = /*#__PURE__*/freeze(Null({
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

const isAutoScope = (type        )          =>
	type==='FunctionExpression' ||
	type==='FunctionDeclaration';

function ReferenceVisitors (globals                                                ) {
	
	function Identifier (node            , parents                 )       {
		const { name } = node;
		let index         = parents.length;
		if ( name==='arguments' ) {
			while ( index ) {
				const parent = parents[--index];
				if ( scope_has(parent, name) || isAutoScope(parent.type) ) { return; }
			}
		}
		else {
			while ( index ) {
				if ( scope_has(parents[--index], name) ) { return; }
			}
		}
		add(globals, node, name);
	}
	
	function ThisExpression (node                , parents                 )       {
		for ( let index         = parents.length; index; ) {
			if ( isAutoScope(parents[--index].type) ) { return; }
		}
		add(globals, node, 'this');
	}
	
	return Null({
		Identifier,// reference
		VariablePattern: Identifier,// definition
		ThisExpression,
	});
	
}
function add (globals                                                , node                             , name        )       {
	const nodes = globals.get(name);
	if ( nodes ) { nodes.push(node); }
	else { globals.set(name, [ node ]); }
}

const assign = Object.assign;

const toStringTag = typeof Symbol!=='undefined' ? Symbol.toStringTag : undefined;

const defineProperty = Object.defineProperty;

const seal = Object.seal;

const Default = (
	/*! j-globals: default (internal) */
	function Default (exports, addOnOrigin) {
		return /*#__PURE__*/ function Module (exports, addOnOrigin) {
			if ( !addOnOrigin ) { addOnOrigin = exports; exports = create(NULL); }
			if ( assign ) { assign(exports, addOnOrigin); }
			else { for ( var key in addOnOrigin ) { if ( hasOwnProperty.call(addOnOrigin, key) ) { exports[key] = addOnOrigin[key]; } } }
			exports['default'] = exports;
			typeof exports==='function' && exports.prototype && seal(exports.prototype);
			if ( toStringTag ) {
				var descriptor = create(NULL);
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
	base.FieldDefinition = function (node                           , state_parents                        , _continue                                                                                 )       {
		if ( node.computed ) { _continue(node.key, state_parents, 'Expression'); }
		const { value } = node;
		if ( value ) { _continue(value, state_parents, 'Expression'); }
	};
}

class Globals extends Map                                            {
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

function findGlobals (AST                                             )          {
	scope_new();
	try {
		const globals          = new Globals;
		ancestor(AST, DECLARATION_VISITORS);
		ancestor(AST, ReferenceVisitors(globals));
		if ( AST.type==='Program' && AST.sourceType!=='module' ) { scope_low(AST, globals); }
		return globals;
	}
	finally { scope_old(); }
}
const _default = Default(findGlobals, { version });

module.exports = _default;

//# sourceMappingURL=index.js.map