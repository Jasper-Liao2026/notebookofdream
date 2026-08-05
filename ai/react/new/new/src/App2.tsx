import * as React from 'react';
import Hello from './components/Hello';
import NameEditComponent from './components/NameEditComponent2';

const App:React.FC = () =>{
  const [username,setUsername]= React.useState("initialName");
  // const setUsernameState = (event:React.ChangeEvent<HTMLInputElement>) =>{
  //   setUsername(event.target.value)
  // }
  return (
    <div>
      <Hello username={username} />
      <NameEditComponent 
      initialUserName={username}
      onNameUpdated={setUsername}
       />
    </div>
  )
}
export default App;