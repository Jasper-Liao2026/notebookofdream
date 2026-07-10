import path, { extname, normalize } from 'path'
//dirname 获取父级路径
console.log(path.dirname(process.cwd()))
console.log(path.dirname('a/b/c'))

console.log(process.cwd())

//base获取路径的最后部分，第二个参数会删除匹配的字符
console.log(path.basename('a/b/c.js'))
console.log(path.basename('a/b/c.js','.js'))
console.log(path.basename('a/b/c.js','.js'))
console.log(path.basename('a/b/c.js','s'))

// normalize规范化处理路径
console.log(path.normalize('a/b//c/d/e/..'))

// extname 获取路径最后一部分扩展名
console.log(path.extname('a/b/c.js'))

//parse把路径拆成对象
console.log(path.parse('/home/user/dir/file.txt'))
