//模板字面量类型
// T 必须是字符串类型
type GetId<T extends string> = T extends `user-${infer Id}` ? Id : never

type A = GetId<`user-${number}`>
const a:A = '234'