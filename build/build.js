'use strict';

require('j-dev')(__dirname+'/..')(async ({ build, 龙腾道, get, map }) => {
	
	await build({
		name: 'acorn-globals',
		user: 'LongTengDao@ltd',
		Auth: 龙腾道,
		Copy: 'LGPL-3.0',
		semver: await get('src/version'),
		ES: 6,
		NPM: {
			description:
				'Global references detection tool adapted from acorn-globals. Belong to "Plan J".／'+
				'改编自 acorn-globals 的全局引用检测工具。从属于“简计划”。',
			dependencies: {
				'acorn-walk': '8.2.0',
			},
		},
		LICENSE_: true,
	});
	
	await map('docs/README.md', 'dist/NPM/README.md');
	
});
