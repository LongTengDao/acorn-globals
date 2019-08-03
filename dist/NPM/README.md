
`@ltd/acorn-globals`
====================

[**English**](#user-content-en) | [简体中文](#user-content-zhs)<a id="user-content-en">&nbsp;</a>

Important Notes
---------------

This package is adapted from [`acorn-globals@4.3.3`](https://www.npmjs.org/package/acorn-globals).

When I found improvable things in use, I submitted some PR for to improve it together.

But there's one thing I think it's not a defect, but a requirement for most people, but not for me, so I can only publish a modified package.

The major difference is that `acorn-globals` automatically ignores references to global `undefined` variables, while `@ltd/acorn-globals` reserves it to decide in user land.

Other differences
-----------------

1.  Reduce the API: The the main export function only accepts the parsed `ast` parameter, not the `string` and `options` parameters, and `parse` method function export is removed, because users will extend different grammar plug-ins to `acorn`'s Parser in different cases.
    
2.  Parameter Read-Only: No modification of `ast` parameter (`acorn-globals` modified the `locals` and `parents` properties of nodes).
    
3.  Return Value: The return value is changed from `{ name :string, nodes :Node[] }[]` to `Map<string, Node[]> & { names (): string[], nodes () :Node[] }`.
    
4.  Dependency Extension: The `base.FieldDefinition` of the dependency package `acorn-walk` is extended to support the `acorn-class-fields` and `acorn-static-class-features` grammar plug-ins which are still in stage 3.
    
5.  Host Requirement: Because it is a back-end package, it uses ES 6+ feature.
    
6.  License: From `MIT` to `LGPL-3.0`, almost same unlimited for using, while the difference is that if the package itself is modified, it must be released as open source with the same license.

[English](#user-content-en) | [**简体中文**](#user-content-zhs)<a id="user-content-zhs">&nbsp;</a>

重要说明
--------

这个包改编自 [`acorn-globals@4.3.3`](https://www.npmjs.org/package/acorn-globals)。

我在使用中发现可以改进的地方时，都第一时间提交了 PR 以共同完善。

但是其中有一处我认为是它的功能而非缺陷，也是多数人的需求，但不是我的需求，因而只能单独发布一个修改后的包。

这个最重要的差异就是，`acorn-globals` 会自动忽略对于全局 `undefined` 变量的引用，而 `@ltd/acorn-globals` 会保留，供用户自行取舍。

其它不同
--------

1.  缩小接口：模块主导出函数只接受解析后的 `ast` 参数，不接受 `string` 和 `options` 参数，同时取消导出 `parse` 方法函数，因为不同场景下用户会对 `acorn` 的 `Parser` 扩展不同的语法插件。
    
2.  参数只读：不对 `ast` 参数作修改（`acorn-globals` 中修改了节点的 `locals` 和 `parents` 属性）。
    
3.  返回形式：返回值从 `{ name :string, nodes :Node[] }[]` 改为 `Map<string, Node[]> & { names () :string[], nodes () :Node[] }`。
    
4.  依赖扩展：扩展了依赖包 `acorn-walk` 的 `.base.FieldDefinition`，用于支持尚处于 stage 3 的 `acorn-class-fields`、`acorn-static-class-features` 语法插件。
    
5.  宿主要求：由于是后端用包，使用了 ES 6 以上的特性。
    
6.  许可协议：从 `MIT` 变为 `LGPL-3.0`，使用上一样，几乎就是没限制，主要区别是如果对包本身进行了改造，则必须以同样许可协议开源发布。
