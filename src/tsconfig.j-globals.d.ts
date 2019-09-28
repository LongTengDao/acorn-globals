
declare module '.Array' { export default Array; }
declare module '.Array.isArray?=' { export default isArray;
	function isArray (value :any) :value is readonly any[];
}
declare module '.Array.prototype' { export default Array.prototype; }
declare module '.Array.prototype.push' { export default Array.prototype.push; }

declare module '.Error' { export default Error; }

declare module '.Infinity' { export default Infinity; }

declare module '.Map' { export default constructor;
	class constructor<K, V> extends Map<K, V> {
		constructor (entries? :Iterable<Readonly<{ 0 :K, 1 :V }>>)
	}
}

declare module '.Math.floor' { export default Math.floor; }

declare module '.Object.assign' { export default Object.assign; }
declare module '.Object.create' { export default create;
	function create<P extends object | null, D extends TypedPropertyDescriptorMap<object> | void> (proto :P,    descriptorMap? :D) :object & ( D extends TypedPropertyDescriptorMap<infer O> ? O : object ) & ( P extends object ? { [K in keyof P] :P[K] } : object );
	type TypedPropertyDescriptorMap<O> = { [K in keyof O] :TypedPropertyDescriptor<O[K]> };
}
declare module '.Object.defineProperty' { export default Object.defineProperty; }
declare module '.Object.freeze' { export default Object.freeze; }
declare module '.Object.prototype' { export default Object.prototype; }
declare module '.Object.prototype.hasOwnProperty' { export default Object.prototype.hasOwnProperty; }
declare module '.Object.prototype.toString' { export default Object.prototype.toString; }
declare module '.Object.seal' { export default Object.seal; }

declare module '.Reflect.apply' { export default apply;
	function apply<This extends any, Args extends { length :number, [index :number] :any }, Target extends (this :This, ...args :Args & any[]) => any> (target :Target, thisArg :This, args :Readonly<Args>) :Target extends (this :This, ...args :Args & any[]) => infer R ? R : never;
}

declare module '.Set' { export default constructor;
	class constructor<V> extends Set<V> {
		constructor (values? :Iterable<V>)
	}
}

declare module '.String.fromCharCode' { export default String.fromCharCode; }

declare module '.Symbol.species?' { export default Symbol.species; }
declare module '.Symbol.toStringTag?' { export default Symbol.toStringTag; }

declare module '.WeakMap' { export default constructor;
	class constructor<K extends object, V> extends WeakMap<K, V> {
		constructor (entries? :Iterable<Readonly<{ 0 :K, 1 :V }>>)
	}
}

declare module '.class.isPrimitive' { export default isPrimitive;
	function isPrimitive (value :any) :value is undefined | null | boolean | string | symbol | number | bigint;
}

declare module '.default' { export default Default;
	function Default<Exports extends Readonly<{ [key :string] :any, default? :Module<Exports> }>> (exports :Exports) :Module<Exports>;
	function Default<Statics extends Readonly<{ [key :string] :any, default? :ModuleFunction<Statics, Main> }>, Main extends Callable | Newable | Callable & Newable> (main :Main, statics :Statics) :ModuleFunction<Statics, Main>;
	type Module<Exports> = Readonly<Exports & { default :Module<Exports> }>;
	type ModuleFunction<Statics, Main> = Readonly<Statics & { default :ModuleFunction<Statics, Main> }> & Main;
	type Callable = (...args :any) => any;
	type Newable = { new (...args :any) :any };
}

declare module '.native' { export default _; const _ :never; }

declare module '.null' { export default NULL;
	const NULL :{
		new<ValueType> () :NULL<ValueType>,
		new () :object,
		<_ extends never, ObjectType extends object> (object :ObjectType) :ObjectType,
		<ValueType> (object :object) :NULL<ValueType>,
	};
	type NULL<ValueType> = {
		[key :string] :undefined | ValueType,
		toString? :ValueType,
		toLocaleString? :ValueType,
		valueOf? :ValueType,
		hasOwnProperty? :ValueType,
		isPrototypeOf? :ValueType,
		propertyIsEnumerable? :ValueType,
		__defineGetter__? :ValueType,
		__defineSetter__? :ValueType,
		__lookupGetter__? :ValueType,
		__lookupSetter__? :ValueType,
		__proto__? :ValueType,
		constructor? :ValueType,
	};
}
declare module '.null.prototype' { export default NULL;
	const NULL :object | null;
}

declare module '.undefined' { export default undefined; }
