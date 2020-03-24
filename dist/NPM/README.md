
`@ltd/acorn-globals`
====================

[**English**](#user-content-en) | [简体中文](#user-content-zhs)<a id="user-content-en">&nbsp;</a>

Important Notes
---------------

This package is adapted from `acorn-globals` (v4.3.4).

When I found improvable things in use, I submitted some PR for to improve it together.

But there's one thing I think it's not a defect, but a requirement for most people, but not for me, so I can only publish a modified package.

The major difference is that `acorn-globals` automatically ignores references to global variable `undefined`, while `@ltd/acorn-globals` reserves it to decide in user land.

At the same time, if the `sourceType` property of the input `Program` node is not `module`, the variable names declared at top-level will also be included in the output.

Other differences
-----------------

1.  License: From `MIT` to `LGPL-3.0`, almost same unlimited for using, while the difference is that if the package itself is modified, it must be released as open source with the same license.
    
2.  Host Requirement: Because it is a back-end package, it uses ES 6+ feature.
    
3.  Reduce the API: The the main export function only accepts the parsed `AST` object as argument, not the `code` string and `options` arguments, and no `parse` method exported.
    Because users may use different versions and grammar plug-ins with different `options` in different cases, I don't want too much coupling.
    
4.  Dependency Extension: The `base.FieldDefinition` of the dependency package `acorn-walk` is extended to support the `acorn-class-fields` and `acorn-static-class-features` grammar plug-ins which are still in stage 3.
    
5.  Parameter Read-Only: No modification of `AST` argument (`acorn-globals` modified the `locals` and `parents` properties of nodes).
    
6.  Return Value: The return value is changed from `{ name :string, nodes :Node[] }[]` to `Map<string, Node[]> & { names (): string[], nodes () :Node[] }`.

```ts
const find = require('@ltd/acorn-globals');

const AST = require('acorn').Parser/*.extend(plugin)*/.parse(code/*, options*/);

const globals = find(AST);

globals as Map<string, Node[]> & { names () :string[], nodes () :Node[] };
```

[English](#user-content-en) | [**简体中文**](#user-content-zhs)<a id="user-content-zhs">&nbsp;</a>

重要说明
--------

这个包改编自 `acorn-globals`（v4.3.4）。

我在使用中发现可以改进的地方时，都第一时间提交了 PR 以共同完善。

但是其中有一处我认为是它的功能而非缺陷，也是多数人的需求，但不是我的需求，因而只能单独发布一个修改后的包。

这个最重要的差异就是，`acorn-globals` 会自动忽略对于全局变量 `undefined` 的引用，而 `@ltd/acorn-globals` 会保留，供用户自行取舍。

同时，如果传入的 `Program` 节点的 `sourceType` 属性不是 `"module"`，那么顶层声明的变量名也会列入全局名录。

其它不同
--------

1.  许可协议：从 `MIT` 变为 `LGPL-3.0`，使用上一样，几乎就是没限制，主要区别是如果对包本身进行了改造，则必须以同样许可协议开源发布。
    
2.  宿主要求：由于是后端用包，使用了 ES 6 以上的特性。
    
3.  缩小接口：模块主导出函数只接受解析后的 `AST` 对象作为参数，而不接受 `code` 字符串和 `options`，同时取消导出 `parse` 方法函数，以尽可能解除耦合，满足用户对不同 `acorn` 版本、语法插件、`options` 的需求。
    
4.  依赖扩展：扩展了依赖包 `acorn-walk` 的 `base.FieldDefinition`，用于支持尚处于 stage 3 的 `acorn-class-fields`、`acorn-static-class-features` 语法插件。
    
5.  参数只读：不对 `AST` 参数作修改（`acorn-globals` 中修改了节点的 `locals` 和 `parents` 属性）。
    
6.  返回形式：返回值从 `{ name :string, nodes :Node[] }[]` 改为 `Map<string, Node[]> & { names () :string[], nodes () :Node[] }`。

```ts
const find = require('@ltd/acorn-globals');

const AST = require('acorn').Parser/*.extend(plugin)*/.parse(code/*, options*/);

const globals = find(AST);

globals as Map<string, Node[]> & { names () :string[], nodes () :Node[] };
```
