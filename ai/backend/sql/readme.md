# SQL

## 后端业务有几张表
文章、点赞、收藏、评论、用户、头像
- 怎么建表
- 怎么建索引
- 怎么建约束

## 用户表
- 用户规模 性能
    用户得登录，用户表最好只存储id，username，password 核心字段
    user表比较小，有利于分布式，有利于快速查询，有时候还要分表
    id 自增 Primary Key
    username Unique Key 不能重复
    password 不能存明文
    头像、slogan 可以另外建表关联查询

索引？Index，多少类索引，为啥建？
查询需求 高频查询 安排索引

## 头像表
头像图片服务器放在静态服务器上
/public/avatar/:id

nest.js 数据库 后端业务 部署在中央机房 强关联的 juejin.cn
由nginx反向代理的一批服务器集群中

cdn 服务器 content dilivery network

