let friends=[];

async function loadData(){
    // console.log('loadData');
    // endpoint
    const endpoint='http://localhost:3000/friends';
    //异步变同步   
    const res=await fetch(endpoint)//发送请求 异步
    const data=await res.json();
    return data;
    //等待响应返回
    //响应体是json字符串 转换为json对象
        then(res=>res.json())
        .then(data =>{
            console.log(data);
        })
}
function renderData(friends){
    console.log('renderData');
    const oBody=document.querySelector('table tbody')
    if(friends.length>0){
        oBody.innerHTML=friends.map(function(friend){
            console.log(friend);
            return `<tr>
                <td>${friend.id}</td>
                <td>${friend.name}</td>
                <td>${friend.age}</td>
            </tr>`
        }).join('')

    }
}
async function init(){
    console.log('init start');
    const friends=await loadData();
    console.log(friends);
    
    renderData();
}
init();
console.log('init end');