//全局负责 提供用户身份状态存储
//创建store
import { create } from 'zustand';
//hooks编程 自定义hooks
export const useAuthStore = create(set=>({
    //set 修改状态的方法
    token:'1111',
    user:null,
    // actions 动作
    setAuth:({token,user})=>{
        set({
            token,
            user
        })
    },
    logout:()=>{
        set({
            token:'',
            user:null
        })
    }
}))