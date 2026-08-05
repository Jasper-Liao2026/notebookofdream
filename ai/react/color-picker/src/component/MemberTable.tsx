import * as React from 'react';
import { type MemberEntity } from '../model/member';
import { getMembersCollection } from '../model/memberApi'

const MemberRow: React.FC<{ member: MemberEntity }> = ({ member }) => {
    return (
        <tr>
            <td>
                <img src={member.avatar_url} style={{ maxWidth: '10rem' }} />
            </td>
            <td>
                <span>{member.id}</span>
            </td>
            <td>
                <span>{member.login}</span>
            </td>
        </tr>
    );
};

const MemberTable: React.FC = () => {
    const [memberCollection,setMemberCollection] = React.useState<MemberEntity[]>([
        {
            id: 1,
            avatar_url: '',
            login: 'jasper',
        },
        {
            id: 2,
            avatar_url: '',
            login: 'jijfi',
        },
    ]);

    React.useEffect(()=>{
        //挂载后请求接口 不会影响组件的渲染
        (async()=>{
            const members = await getMembersCollection();
            setMemberCollection(members);
        })()

    },[])

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Avatar</th>
                        <th>ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {memberCollection.map((member:MemberEntity) => (
                        <MemberRow key={member.id} member={member} />
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default MemberTable;
