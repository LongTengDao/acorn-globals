'use strict';

const version = '3.0.0';

const WeakMap$1 = WeakMap;

const Error$1 = Error;

const Set$1 = Set;

const Map$1 = Map;

const push = Array.prototype.push;

const apply = Reflect.apply;

class Globals extends Map$1                                            {
	constructor () { return super()                   ; }
	names (             )           {
		return [ ...this.keys() ];
	}
	nodes (             ) {
		const nodes                                    = [];
		for ( const value of this.values() ) { apply(push, nodes, value); }
		return nodes;
	}
}

const SCOPE_NAMES                             = new WeakMap$1;
const GLOBALS = new Globals;
const ROOT = { type: 'Program' };
let scope_names                             = SCOPE_NAMES;
let globals          = GLOBALS;
let root       = ROOT;
let notModule          = false;

const scope_new = (AST                                                      )       => {
	if ( scope_names!==SCOPE_NAMES  ) { throw Error$1(`Can't start new finding before previous finding finished.`); }
	scope_names = new WeakMap$1;
	globals = new Globals;
	root = AST;
	notModule = AST.sourceType!=='module' || AST.type!=='Program';
};

const scope_add = (scope      , { name }            )       => {
	const names = scope_names.get(scope);
	names
		? names.add(name)
		: scope_names.set(scope, new Set$1        ().add(name));
};

const scope_has = (scope      , name        )          => {
	const names = scope_names.get(scope);
	return names ? names.has(name) : false;
};

const globals_add = (node                             , name        )       => {
	const nodes = globals.get(name);
	nodes
		? nodes[nodes.length] = node
		: globals.set(name, [ node ]);
};

const scope_old = ()       => {
	scope_names = SCOPE_NAMES;
	globals = GLOBALS;
	root = ROOT;
};

const freeze = Object.freeze;

const Object_keys = Object.keys;

const getOwnPropertySymbols = Object.getOwnPropertySymbols;

const undefined$1 = void null;

const hasOwnProperty = Object.prototype.hasOwnProperty;

const propertyIsEnumerable = Object.prototype.propertyIsEnumerable;

const NULL = (
	/*! j-globals: null.prototype (internal) */
	Object.seal
		? /*#__PURE__*/Object.preventExtensions(Object.create(null))
		: null
	/*¡ j-globals: null.prototype (internal) */
);

var isEnum = /*#__PURE__*/propertyIsEnumerable.call.bind(propertyIsEnumerable);
var hasOwn = /*#__PURE__*/function () {
	return hasOwnProperty.bind
		? hasOwnProperty.call.bind(hasOwnProperty)
		: function (object, key) { return hasOwnProperty.call(object, key); };
}();// && object!=null

var create$1 = Object.create;

const Null = (
	/*! j-globals: null (internal) */
	/*#__PURE__*/function () {
		var assign = Object.assign || function assign (target, source) {
			var keys, index, key;
			for ( keys = Object_keys(source), index = 0; index<keys.length;++index ) {
				key = keys[index];
				target[key] = source[key];
			}
			if ( getOwnPropertySymbols ) {
				for ( keys = getOwnPropertySymbols(source), index = 0; index<keys.length;++index ) {
					key = keys[index];
					if ( isEnum(source, key) ) { [key] = source[key]; }
				}
			}
			return target;
		};
		function Nullify (constructor) {
			delete constructor.prototype.constructor;
			freeze(constructor.prototype);
			return constructor;
		}
		var Null = function (origin) {
			return origin===undefined$1
				? this
				: typeof origin==='function'
					? /*#__PURE__*/Nullify(origin)
					: /*#__PURE__*/assign(/*#__PURE__*/create$1(NULL), origin);
		};
		delete Null.name;
		//try { delete Null.length; } catch (error) {}
		Null.prototype = null;
		freeze(Null);
		return Null;
	}()
	/*¡ j-globals: null (internal) */
);

const isVarScope = (type        )          =>
	type==='FunctionDeclaration'
	||
	type==='FunctionExpression'
	||
	type==='ArrowFunctionExpression'
	||
	type==='StaticBlock'
;

const isLetScope = (type        )          =>
	type==='BlockStatement'
	||
	isVarScope(type);

const Pattern = (node         , scope             )       => {
	switch ( node.type ) {
		
		case 'Identifier':
			scope ? scope_add(scope, node) : globals_add(node, node.name);
			break;
		
		case 'ObjectPattern':{// { Pattern }
			let index         = 0;
			for ( const { properties } = node, { length } = properties; index<length; ++index ) {
				const property = properties[index] ;
				switch ( property.type ) {
					case 'Property':// { key: valuePattern }
						Pattern(property.value, scope);
						break;
					case 'RestElement':// { ...argumentPattern }
						Pattern(property.argument, scope);
						break;
					default:
						throw Error$1(`Unrecognized pattern type: ${property.type}`);
				}
			}
			break;
		}
		
		case 'ArrayPattern': {// [ , Pattern ]
			let index         = 0;
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
			throw Error$1(`Unrecognized pattern type: ${node.type}`);
			
	}
};

const ImportSpecifier_ImportDefaultSpecifier_ImportNamespaceSpecifier = ({ local }                  , parents                 )       => {
	scope_add(parents[0] , local);
};
const DECLARATION_VISITORS = /*#__PURE__*/freeze(Null({
	
	ImportSpecifier: ImportSpecifier_ImportDefaultSpecifier_ImportNamespaceSpecifier,
	ImportDefaultSpecifier: ImportSpecifier_ImportDefaultSpecifier_ImportNamespaceSpecifier,
	ImportNamespaceSpecifier: ImportSpecifier_ImportDefaultSpecifier_ImportNamespaceSpecifier,
	
	VariableDeclaration: (node                     , parents                 )       => {
		const isScope = node.kind==='var' ? isVarScope : isLetScope;
		const { declarations } = node;
		const { length } = declarations;
		let index         = parents.length;
		while ( index>1 ) {
			const parent = parents[--index] ;
			if ( isScope(parent.type) ) {
				index = 0;
				while ( index<length ) { Pattern(declarations[index++] .id, parent); }
				return;
			}
		}
		index = 0;
		while ( index<length ) { Pattern(declarations[index++] .id, notModule ? null : root); }
	},
	
	Function: (scope           )       => {
		let index         = 0;
		for ( const { params } = scope, { length } = params; index<length; ++index ) { Pattern(params[index] , scope); }
		const { id } = scope;
		id && scope_add(scope, id);
	},
	
	FunctionDeclaration: (node           , parents                 )       => {
		const { id } = node;
		if ( id ) {
			let index         = parents.length - 2;
			while ( index>0 ) {
				const parent = parents[index--] ;
				if ( isLetScope(parent.type) ) {
					scope_add(parent, id);
					if ( notModule && parent.type==='BlockStatement' ) {
						while ( index ) {
							if ( isVarScope(parents[index--] .type) ) { return; }
						}
						globals_add(id, id.name);
					}
					return;
				}
			}
			notModule ? globals_add(id, id.name) : scope_add(root, id);
		}
	},
	
	Class: (scope        )       => {
		const { id } = scope;
		id && scope_add(scope, id);
	},
	
	ClassDeclaration: (node        , parents                 )       => {
		const { id } = node;
		if ( id ) {
			let index         = parents.length - 2;
			while ( index>0 ) {
				const parent = parents[index--] ;
				if ( isLetScope(parent.type) ) {
					scope_add(parent, id);
					return;
				}
			}
			notModule ? globals_add(id, id.name) : scope_add(root, id);
		}
	},
	
	TryStatement: ({ handler }              )       => {
		if ( handler ) {
			const { param } = handler;
			param && Pattern(param, handler);
		}
	},
	
}));

const Identifier_VariablePattern = (node            , parents                 )       => {
	const { name } = node;
	let index         = parents.length;
	if ( name==='arguments' ) {
		while ( index ) {
			const parent = parents[--index] ;
			if ( scope_has(parent, name) ) { return; }
			const { type } = parent;
			if ( type==='FunctionExpression' || type==='FunctionDeclaration' ) { return; }
		}
	}
	else {
		while ( index ) {
			if ( scope_has(parents[--index] , name) ) { return; }
		}
	}
	globals_add(node, name);
};

const REFERENCE_VISITORS = /*#__PURE__*/ freeze(Null({
	Identifier: Identifier_VariablePattern,// reference
	VariablePattern: Identifier_VariablePattern,// definition
	ThisExpression: (node                , parents                 )       => {
		let index         = parents.length;
		while ( index ) {
			const parent = parents[--index] ;
			const { type } = parent;
			if ( type==='FunctionExpression' || type==='FunctionDeclaration' || type==='StaticBlock' || type==='PropertyDefinition' && parents[index+1]===( parent                       ).value ) { return; }
		}
		globals_add(node, 'this');
	},
}));

const create = Object.create;

const toStringTag = typeof Symbol==='undefined' ? undefined$1 : Symbol.toStringTag;

const defineProperty = Object.defineProperty;

const assign = Object.assign;

const Default = (
	/*! j-globals: default (internal) */
	function Default (exports, addOnOrigin) {
		if ( !addOnOrigin ) { addOnOrigin = exports; exports = create(NULL); }
		if ( assign ) { assign(exports, addOnOrigin); }
		else { for ( var key in addOnOrigin ) { if ( hasOwn(addOnOrigin, key) ) { exports[key] = addOnOrigin[key]; } } }
		exports.default = exports;
		if ( toStringTag ) {
			var descriptor = create(NULL);
			descriptor.value = 'Module';
			defineProperty(exports, toStringTag, descriptor);
		}
		typeof exports==='function' && exports.prototype && freeze(exports.prototype);
		return freeze(exports);
	}
	/*¡ j-globals: default (internal) */
);

const { ancestor }                              = require('acorn-walk');

const findGlobals = (AST      ) => {
	scope_new(AST);
	try {
		ancestor(AST, DECLARATION_VISITORS);
		ancestor(AST, REFERENCE_VISITORS);
		return globals;
	}
	finally { scope_old(); }
};
const _default = Default(findGlobals, { version });

module.exports = _default;

//# sourceMappingURL=index.js.map