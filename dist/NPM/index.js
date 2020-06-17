'use strict';

const version = '1.8.0';

const Map$1 = Map;

const push = Array.prototype.push;

const apply = Reflect.apply;

const WeakMap$1 = WeakMap;

const Error$1 = Error;

const Set$1 = Set;

const SCOPE_NAMES                             = new WeakMap$1;

let scope_names                             = SCOPE_NAMES;

const scope_new = ()       => {
	if ( scope_names!==SCOPE_NAMES  ) { throw Error$1(`Can't start new finding before previous finding finished.`); }
	scope_names = new WeakMap$1;
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

const scope_low = (scope      , globals                                                )       => {
	const names = scope_names.get(scope);
	if ( names ) { for ( const name of names ) { globals.set(name, []); } }
};

const scope_old = ()       => {
	scope_names = SCOPE_NAMES;
};

const freeze = Object.freeze;

const Object_keys = Object.keys;

const getOwnPropertySymbols = typeof Object!=='undefined' ? Object.getOwnPropertySymbols : undefined;

const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

const undefined$1 = void 0;

const NULL = (
	/*! j-globals: null.prototype (internal) */
	Object.seal
		? /*#__PURE__*/ Object.preventExtensions(Object.create(null))
		: null
	/*¡ j-globals: null.prototype (internal) */
);

var create = Object.create;

const Null = (
	/*! j-globals: null.constructor (internal) */
	/*#__PURE__*/ function () {
		var assign = Object.assign || function assign (target, source) {
			var keys, index, key;
			for ( keys = Object_keys(source), index = 0; index<keys.length;++index ) {
				key = keys[index];
				target[key] = source[key];
			}
			if ( getOwnPropertySymbols ) {
				for ( keys = getOwnPropertySymbols(source), index = 0; index<keys.length;++index ) {
					key = keys[index];
					if ( getOwnPropertyDescriptor(source, key).enumerable ) { [key] = source[key]; }
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
					? /*#__PURE__*/ Nullify(origin)
					: /*#__PURE__*/ assign(/*#__PURE__*/ create(NULL), origin);
		};
		delete Null.name;
		//try { delete Null.length; } catch (error) {}
		Null.prototype = null;
		freeze(Null);
		return Null;
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

const Pattern = (node         , scope      )       => {
	switch ( node.type ) {
		
		case 'Identifier':
			scope_add(scope, node);
			break;
		
		case 'ObjectPattern':{// { Pattern }
			let index         = 0;
			for ( const { properties } = node, { length } = properties; index<length; ++index ) {
				const property = properties[index];
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

const VariableDeclaration = (node                     , parents                 )       => {
	const isScope = node.kind==='var' ? isVarScope : isAnyScope;
	let index         = parents.length;
	while ( index ) {
		const parent = parents[--index];
		if ( isScope(parent.type) ) {
			let index         = 0;
			for ( const { declarations } = node, { length } = declarations; index<length; ++index ) { Pattern(declarations[index].id, parent); }
			break;
		}
	}
};

const Function = (scope           )       => {
	let index         = 0;
	for ( const { params } = scope, { length } = params; index<length; ++index ) { Pattern(params[index], scope); }
	const { id } = scope;
	id && scope_add(scope, id);
};
const FunctionDeclaration = (node           , parents                 )       => {
	const { id } = node;
	if ( id ) {
		let index         = parents.length - 1;
		while ( index ) {
			const parent = parents[--index];
			if ( isVarScope(parent.type) ) {
				scope_add(parent, id);
				break;
			}
		}
	}
	Function(node);
};

const Class = (scope        )       => {
	const { id } = scope;
	id && scope_add(scope, id);
};
const ClassDeclaration = (node        , parents                 )       => {
	const { id } = node;
	if ( id ) {
		let index         = parents.length - 1;
		while ( index ) {
			const parent = parents[--index];
			if ( isAnyScope(parent.type) ) {
				scope_add(parent, id);
				break;
			}
		}
	}
	Class(node);
};

const TryStatement = ({ handler }              )       => {
	if ( handler ) {
		const { param } = handler;
		param && Pattern(param, handler);
	}
};

const Import$Specifier = ({ local }                  , parents                 )       => {
	scope_add(parents[0], local);
};

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

const add = (globals                                                , node                             , name        )       => {
	const nodes = globals.get(name);
	nodes
		? nodes[nodes.length] = node
		: globals.set(name, [ node ]);
};

const ReferenceVisitors = (globals                                                ) => {
	
	const Identifier = (node            , parents                 )       => {
		const { name } = node;
		let index         = parents.length;
		if ( name==='arguments' ) {
			while ( index ) {
				const parent = parents[--index];
				if ( scope_has(parent, name) ) { return; }
				const { type } = parent;
				if ( type==='FunctionExpression' || type==='FunctionDeclaration' ) { return; }
			}
		}
		else {
			while ( index ) {
				if ( scope_has(parents[--index], name) ) { return; }
			}
		}
		add(globals, node, name);
	};
	
	const ThisExpression = (node                , parents                 )       => {
		let index         = parents.length;
		while ( index ) {
			const parent = parents[--index];
			const { type } = parent;
			if ( type==='FunctionExpression' || type==='FunctionDeclaration' || type==='FieldDefinition' && parents[index+1]===( parent                    ).value ) { return; }
		}
		add(globals, node, 'this');
	};
	
	return Null({
		Identifier,// reference
		VariablePattern: Identifier,// definition
		ThisExpression,
	});
	
};

const create$1 = Object.create;

const toStringTag = typeof Symbol!=='undefined' ? Symbol.toStringTag : undefined;

const defineProperty = Object.defineProperty;

const assign = typeof Object!=='undefined' ? Object.assign : undefined;

const Default = (
	/*! j-globals: default (internal) */
	function Default (exports, addOnOrigin) {
		return /*#__PURE__*/ function Module (exports, addOnOrigin) {
			if ( !addOnOrigin ) { addOnOrigin = exports; exports = create$1(NULL); }
			if ( assign ) { assign(exports, addOnOrigin); }
			else { for ( var key in addOnOrigin ) { if ( getOwnPropertyDescriptor(addOnOrigin, key) ) { exports[key] = addOnOrigin[key]; } } }
			exports.default = exports;
			if ( toStringTag ) {
				var descriptor = create$1(NULL);
				descriptor.value = 'Module';
				defineProperty(exports, toStringTag, descriptor);
			}
			typeof exports==='function' && exports.prototype && freeze(exports.prototype);
			return freeze(exports);
		}(exports, addOnOrigin);
	}
	/*¡ j-globals: default (internal) */
);

const { ancestor, base }                                              = require('acorn-walk');

base.FieldDefinition ?? ( base.FieldDefinition = (
	node                           ,
	state_or_parents                        ,
	_continue   
		                     
		                              
		                
	         
)       => {
	node.computed && _continue(node.key, state_or_parents, 'Expression');
	const { value } = node;
	value && _continue(value, state_or_parents, 'Expression');
} );

class Globals extends Map$1                                            {
	names (             )           {
		return [ ...this.keys() ];
	}
	nodes (             ) {
		const nodes                                    = [];
		for ( const value of this.values() ) { apply(push, nodes, value); }
		return nodes;
	}
}

const findGlobals = (AST                                             )          => {
	scope_new();
	try {
		const globals          = new Globals;
		ancestor(AST, DECLARATION_VISITORS);
		ancestor(AST, ReferenceVisitors(globals));
		AST.type==='Program' && AST.sourceType!=='module' && scope_low(AST, globals);
		return globals;
	}
	finally { scope_old(); }
};
const _default = Default(findGlobals, { version });

module.exports = _default;

//# sourceMappingURL=index.js.map