
declare module '.Array.prototype.push' { export default Array.prototype.push; }

declare module '.Error' { export default Error; }

declare module '.Map' { export default Map; }

declare module '.Object.assign' { export default Object.assign; }
declare module '.Object.create' { export default Object.create; }
declare module '.Object.defineProperty' { export default Object.defineProperty; }
declare module '.Object.freeze' { export default Object.freeze; }
declare module '.Object.prototype.hasOwnProperty' { export default Object.prototype.hasOwnProperty; }
declare module '.Object.seal' { export default Object.seal; }

declare module '.Reflect.apply' { export default Reflect.apply; }

declare module '.Set' { export default Set; }

declare module '.Symbol.toStringTag?' { export default Symbol.toStringTag; }

declare module '.WeakMap' { export default WeakMap; }

declare module '.default' { export default Default;
	function Default<Exports extends Readonly<{ [key :string] :any, default? :Module<Exports> }>> (exports :Exports) :Module<Exports>;
	function Default<Statics extends Readonly<{ [key :string] :any, default? :ModuleFunction<Statics, Main> }>, Main extends Callable | Newable | Callable & Newable> (main :Main, statics :Statics) :ModuleFunction<Statics, Main>;
	type Module<Exports> = Readonly<Exports & { default :Module<Exports> }>;
	type ModuleFunction<Statics, Main> = Readonly<Statics & { default :ModuleFunction<Statics, Main> } & Main>;
	type Callable = (...args :any[]) => any;
	type Newable = { new (...args :any[]) :any };
}