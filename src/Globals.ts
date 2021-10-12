import Map from '.Map';
import push from '.Array.prototype.push';
import apply from '.Reflect.apply';

export default class Globals extends Map<string, ( Identifier | ThisExpression )[]> {
	constructor () { return super() as unknown as this; }
	names (this :Globals) :string[] {
		return [ ...this.keys() ];
	}
	nodes (this :Globals) {
		const nodes :( Identifier | ThisExpression )[] = [];
		for ( const value of this.values() ) { apply(push, nodes, value); }
		return nodes;
	}
}

import type { Identifier, ThisExpression } from './Node';