import axios from "axios";
//axios 全局配置案例
const client = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

export function uploadFile(file: File) {
//表单提交 body请求体
  const form = new FormData();
  form.append("file", file);
//泛型 泛指promise resolve 值的类型
// T 类型作为参数
  return client.post<{
    // 0 没有错误 1 有错误
    code: number;
    //错误信息
    message: string;
    //上传成功的数据
    data: {
      original_name: string;
      saved_name: string;
      size: number;
    };
  }>("/upload", form, {
    headers: {
        //附件、文件上传需要设置content-type 为 multipart/form-data
      "Content-Type": "multipart/form-data",
    },
  });
}