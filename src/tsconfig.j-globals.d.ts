
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
	class constructor<K, V> extends Map<K, V> { constructor (entries? :Iterable<Readonly<{ 0 :K, 1 :V }>>) }
}

declare module '.Math.floor' { export default Math.floor; }

declare module '.Object' { export default O;
	type O = Object;
	const O :{
		<T extends object> (value :T) :T;
		(value? :undefined | null) :object;
		(value :boolean) :Boolean & object;
		(value :number) :Number & object;
		(value :string) :String & object;
		(value :symbol) :Symbol & object;
		(value :bigint) :BigInt & object;
		new<T extends object> (value :T) :T;
		new (value? :undefined | null) :object;
		new (value :boolean) :Boolean & object;
		new (value :number) :Number & object;
		new (value :string) :String & object;
		new (value :symbol) :Symbol & object;
		new (value :bigint) :BigInt & object;
	} & {
		[Method in keyof typeof Object] :typeof Object[Method];
	};
}
declare module '.Object.assign?' { export default Object.assign; }
declare module '.Object.create' { export default create;
	function create<P extends object | null, D extends TypedPropertyDescriptorMap<object> | void> (proto :P,    descriptorMap? :D) :object & ( D extends TypedPropertyDescriptorMap<infer O> ? O : object ) & ( P extends object ? { [K in keyof P] :P[K] } : object );
	type TypedPropertyDescriptorMap<O> = { [K in keyof O] :TypedPropertyDescriptor<O[K]> };
}
declare module '.Object.defineProperty' { export default Object.defineProperty; }
declare module '.Object.freeze' { export default Object.freeze; }
declare module '.Object.getOwnPropertyDescriptor' { export default Object.getOwnPropertyDescriptor; }
declare module '.Object.prototype' { export default Object.prototype; }
declare module '.Object.prototype.hasOwnProperty' { export default Object.prototype.hasOwnProperty; }
declare module '.Object.prototype.toString' { export default Object.prototype.toString; }

declare module '.Reflect.apply' { export default apply;
	function apply<This, Args extends ArrayLike<any>, Target extends (this :This, ...args :Args & any[]) => any> (target :Target, thisArg :This, args :Args) :Target extends (this :This, ...args :Args & any[]) => infer R ? R : never;
}

declare module '.Set' { export default constructor;
	class constructor<V> extends Set<V> { constructor (values? :Iterable<V>) }
}

declare module '.String.fromCharCode' { export default String.fromCharCode; }

declare module '.Symbol.species?' { export default Symbol.species; }
declare module '.Symbol.toStringTag?' { export default Symbol.toStringTag; }

declare module '.WeakMap' { export default constructor;
	class constructor<K extends object, V> extends WeakMap<K, V> { constructor (entries? :Iterable<Readonly<{ 0 :K, 1 :V }>>) }
}

declare module '.class.isPrimitive' { export default isPrimitive;
	function isPrimitive (value :any) :value is undefined | null | boolean | string | symbol | number | bigint;
}

declare module '.default' { export default Default;
	function Default<Exports extends Readonly<{ [name :string] :any, default? :Module<Exports> }>> (exports :Exports) :Module<Exports>;
	function Default<Statics extends Readonly<{ [name :string] :any, default? :ModuleFunction<Statics, Main> }>, Main extends Callable | Newable | Callable & Newable> (main :Main, statics :Statics) :ModuleFunction<Statics, Main>;
	type Module<Exports> = Readonly<Exports & { default :Module<Exports> }>;
	type ModuleFunction<Statics, Main> = Readonly<Statics & { default :ModuleFunction<Statics, Main> }> & Main;
	type Callable = (...args :any) => any;
	type Newable = { new (...args :any) :any };
}

declare module '.native' { export default _; const _ :never; }

declare module '.null' { export default Null;
	function Null<_ extends never, Object extends object> (object :Object) :Object;
	function Null<Value> (object :object & { readonly [name :string] :Value }) :Null<Value>;
	abstract class Null<ValueType = unknown> {}
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
