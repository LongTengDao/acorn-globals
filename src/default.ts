import version from './version?text';

import { globals, scope_new, scope_old } from './scope';
import DECLARATION_VISITORS from './DECLARATION_VISITORS';
import REFERENCE_VISITORS from './REFERENCE_VISITORS';

const { ancestor } :typeof import('acorn-walk') = require('acorn-walk');

const findGlobals = (AST :Node) => {
	scope_new(AST);
	try {
		ancestor(AST, DECLARATION_VISITORS);
		ancestor(AST, REFERENCE_VISITORS);
		return globals;
	}
	finally { scope_old(); }
};

import Default from '.default';
export default Default(findGlobals, { version });

import type { Node } from './Node';