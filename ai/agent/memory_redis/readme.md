# Redis 实现agent 短期记忆存储的最佳方案

## 你了解Agent Memory吗？你是怎么设计的？

Agent Memory 本质就是解决一个问题：大模型(无状态) 本身没有可靠的、跨请求的持久记忆，但是业务又希望他能够记住之前发生的事情，并且在后续对话中利用这些信息

内存message(本轮会话记忆) -> redis(短期记忆 内存数据库 快) -> psql （存储+向量化 长期记忆）

- 短期记忆主要解决当前会话的问题，比如用户前面说了什么、当前任务进行到哪一步了，这部分我倾向于用redis存储，方便快速读取，也比较好设置过期时间
- 长期记忆主要解决跨会话问题，比如用户的个人偏好，长期目标，以及历史交互中值得保留的信息
会使用psql(vector)，更方便的Mem0 记忆管理方案，记忆负责提取、更新和检索，底层再根据架构使用向量数据库
- 另外还有一个非常重要的问题，就是上下文窗口有限

如果我们每次都把完整的聊天记录塞给大模型，随着对话变长，不仅容易超出token限制，还会增加推理成本和响应延迟，所以我会结合上下文截断、总结和相关记忆检索

简单来说 就是Redis 管当前会话，Mem0（psql）管跨会话长期记忆，把当前真正需要的信息组装成Prompt，交给大模型

- 什么是负载均衡？
均衡负载就是把用户请求分给多台服务器，不让某一台抗太多压力，避免卡死，提升整体速度，一台挂了
还能让别的顶上
```json
http{
    upstream backend{
        server 192.168.1.100:8081;
        server 192.168.1.101:8081;
        ...
    }
}
```
- 负载均衡算法
    - 轮询：请求挨个分给服务器
    - 加权轮询：强的服务器多接点或
    - 最少链接：挑现在活最少的服务器
    - IP哈希：同一个用户，一直分到同一台服务器，

## Redis 用于短期记忆存储
Redis 是一个高性能的键值型内存数据库，也是后端开发中最常用的缓存中间件之一

他的数据默认存在内存里，读写延迟通常在亚毫秒级，天生就适合处理像对话上下文这样的高频读写场景

redis 几个特性，完美匹配agent短期记忆的需求

- 支持TTL(过期时间) Time To Live
会话限制一段时间后，数据会自动过期清理，不用我们写额外的定时清理逻辑，非常省心
- 多实例共享数据
所有agent 服务实例都能链接同一个redis ，用户的会话上下文在任何实例上都能被读取，完美解决了负载均衡下的会话共享问题
- 丰富的数据结构
  String 存放对话简要
  Hash 存会话元信息
  List 直接存对话列表
- 持久化

## 使用redis 
- 链接
- CRUD
    - key 索引
    - 数据结构 
        - string
        场景：倒计时验证码 、token、登录会话、计数器、配置项、文本类短期记忆(总结) 倒计时验证码 .... 记忆(总结)文章阅读数 incr counter:article:1024 分布式锁 set lock:order:2001 "locked" nx ed 10
        - 核心命令
        set key value
        get key 秒数 value
        incr key
        decr key 
        incrby key 步长 
        
    - TTL

## 二、hash
使用场景：用户信息的存储、商品资料、购物车、结构对话上下文
hset key field value
hmset key field1 value1 field2 value2
hgetall key 取所有字段值
hkeys key 取所有字段名
hvals key 取所有字段值
hincrby key field 增量

## 三、list
使用场景：消息队列、任务队列、操作日志、聊天历史、有序记录
双向的列表
lpush key value1 value2
rpush key value1 value2
lrange key 0 -1
lpop key
rpop key
llen key

## 四、set集合
使用场景：数组去重、每日签到 ip 黑名单 共同好友 权限标签
sadd key value1 value2
smembers key
sismember key value 检查元素是否在集合中
sinter key1 key2 ...取多个集合的交集
sdiff key1 key2 ...取多个集合的差集
sunion key1 key2 ...取多个集合的并集
## 五、zset有序集合
使用场景：各类排行榜、内容热度排序、用户积分排名、权重队列
zadd key score member
zrange key 0 -1 
zrevarange key 0 -1
zscore key member

## 六、位图

## 七、geo地理位置
使用场景：附近门店、附近用户、附近商品、两地距离计算、位置检索
核心命令：
geoadd key 精度 维度 名称
geodist key 名称1 名称2 km

## 基于redis 实现agent 短期记忆的存储

