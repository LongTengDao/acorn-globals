
declare module '.Array' { export default Array; }
declare module '.Array.isArray?=' { export default isArray;
	function isArray (value :any) :value is readonly any[];
}
declare module '.Array.prototype' { export default Array.prototype; }
declare module '.Array.prototype.push' { export default Array.prototype.push; }

declare module '.Error' { export default Error; }

declare module '.Function.prototype.apply' { export default Function.prototype.apply; }

declare module '.Infinity' { export default Infinity; }

declare module '.Map' { export default constructor;
	class constructor<K, V> extends Map<K, V> { constructor (entries? :Iterable<{ readonly 0 :K, readonly 1 :V }>) }
}

declare module '.Math.floor' { export default Math.floor; }

declare module '.Object' { export default O;
	type O = Object;
	const O :{ [Method in keyof typeof Object] :typeof Object[Method] } & {
		<T> (value :T) :Objectify<T>;
		() :object;
		new<T> (value :T) :Objectify<T>;
		new () :object;
	};
	type Objectify<T> =
		T extends object ? T :
		T extends undefined | null ? object :
		T extends boolean ? object & Boolean :
		T extends number ? object & Number :
		T extends string ? object & String :
		T extends symbol ? object & Symbol :
		T extends bigint ? object & BigInt :
		never;
}
declare module '.Object.assign?' { export default Object.assign; }
declare module '.Object.create' { export default create;
	function create<P extends object | null, D extends TypedPropertyDescriptorMap<object> | void> (proto :P,    descriptorMap? :D) :object & ( D extends TypedPropertyDescriptorMap<infer O> ? O : object ) & ( P extends object ? { [K in keyof P] :P[K] } : object );
	type TypedPropertyDescriptorMap<O> = { [K in keyof O] :TypedPropertyDescriptor<O[K]> };
}
declare module '.Object.defineProperty' { export default Object.defineProperty; }
declare module '.Object.freeze' { export default Object.freeze; }
declare module '.Object.getOwnPropertyDescriptor' { export default Object.getOwnPropertyDescriptor; }
declare module '.Object.getOwnPropertySymbols?' { export default getOwnPropertySymbols;
	function getOwnPropertySymbols<T extends {}> (nonNullable :T) :Extract<keyof T, symbol>[];
}
declare module '.Object.keys' { export default keys;
	function keys<T extends {}> (nonNullable :T) :Extract<keyof T, string>[];
}
declare module '.Object.prototype' { export default Object.prototype; }
declare module '.Object.prototype.hasOwnProperty' { export default Object.prototype.hasOwnProperty; }
declare module '.Object.prototype.toString' { export default Object.prototype.toString; }

declare module '.Reflect.apply' { export default apply;
	function apply<This, Args extends readonly any[], Target extends (this :This, ...args :Args) => any> (target :Target, thisArg :This, args :Args) :Target extends (this :This, ...args :Args) => infer R ? R : never;
}

declare module '.Set' { export default constructor;
	class constructor<V> extends Set<V> { constructor (values? :Iterable<V>) }
}

declare module '.String.fromCharCode' { export default String.fromCharCode; }

declare module '.Symbol.species?' { export default Symbol.species; }
declare module '.Symbol.toStringTag?' { export default Symbol.toStringTag; }

declare module '.WeakMap' { export default constructor;
	class constructor<K extends object, V> extends WeakMap<K, V> { constructor (entries? :Iterable<{ readonly 0 :K, readonly 1 :V }>) }
}

declare module '.class.isPrimitive' { export default isPrimitive;
	function isPrimitive<T> (value :T) :T extends object ? false : true;
}

declare module '.default' { export default Default;
	function Default<Exports extends { readonly [name :string] :any, readonly default? :Module<Exports> }> (exports :Exports) :Module<Exports>;
	function Default<Statics extends { readonly [name :string] :any, readonly default? :ModuleFunction<Statics, Main> }, Main extends Callable | Newable | Callable & Newable> (main :Main, statics :Statics) :ModuleFunction<Statics, Main>;
	type Module<Exports> = Readonly<Exports> & { readonly default :Module<Exports> };
	type ModuleFunction<Statics, Main> = Readonly<Statics & Main> & { readonly default :ModuleFunction<Statics, Main> };
	type Callable = (...args :any) => any;
	type Newable = { new (...args :any) :any };
}

declare module '.native' { export default _; const _ :never; }

declare module '.null' { export default Null;
	function Null (origin :null) :object;
	function Null<_ extends never, Object extends object> (origin :Object) :Object;
	function Null<Value> (origin :null | object & { readonly [name :string] :Value }) :Null<Value>;
	abstract class Null<ValueType = unknown> {
		protected constructor (arg? :undefined);		static readonly prototype :null;
	}
	interface Null<ValueType = unknown> {
		[name :string] :undefined | ValueType
		toString? :ValueType
		toLocaleString? :ValueType
		valueOf? :ValueType
		hasOwnProperty? :ValueType
		isPrototypeOf? :ValueType
		propertyIsEnumerable? :ValueType
		__defineGetter__? :ValueType
		__defineSetter__? :ValueType
		__lookupGetter__? :ValueType
		__lookupSetter__? :ValueType
		__proto__? :ValueType
		constructor? :ValueType
	}
}
declare module '.null.prototype' { export default NULL;
	const NULL :object | null;
}

declare module '.undefined' { export default undefined; }
