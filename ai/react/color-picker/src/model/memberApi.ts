//接口文件

import {type MemberEntity} from "../model/member";

export const getMembersCollection = ():Promise<MemberEntity[]> =>{
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve([
                {
                    id: 1,
                    login: 'jasper',
                    avatar_url: 'https://avatars.githubusercontent.com/u/1',
                },
                {
                    id: 2,
                    login: 'jijfi',
                    avatar_url: 'https://avatars.githubusercontent.com/u/2',
                },
            ])
        },500)
    })
}