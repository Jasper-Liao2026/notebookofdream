# 向量数据库
- loader and splitter
- 内存向量新数据库

## Milvus
文档向量化放到向量数据库，每次查询根据向量化的query 去数据库做相似度匹配，查出相关文档放到prompt里给大模型，大模型来生成回答

- 从内存到向量数据库
Milvus 是一款开源的向量数据库，转为处理海量高维向量数据设计 。AI Agent 产品都会使用Milvus 这样的vector store

像web应用会把数据存在mysql里面，Sqlite，psql，基于堆数据的增删改查实现各种业务功能。CRUD

根据id 或者关键词(like) 去关联查询一些列表的数据
agent 会把

## AI 日记本 diary
- 日记的增删改查CRUD Mysql 非ai功能 结构化数据
- 最近心情比较好的日记
  同时，将entity向量化存储到milvus中 ai 功能

## zilliz