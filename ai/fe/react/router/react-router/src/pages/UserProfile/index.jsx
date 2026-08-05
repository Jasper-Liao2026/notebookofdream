import{
    useParams
} from 'react-router-dom'
import {useState} from 'react';
function UserProfile(){
    //params ? 
    //hooks 思想 
    let {id} = useParams();
    console.log(id);
    return(
        <>
        <h2>User Profile:{id}</h2>  
        </>
    )
}

export default UserProfile