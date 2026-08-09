import ControlledInput from './components/ControlledInput';
import UncontrolledInput from './components/UncontrolledInput';
import CommentBox from './components/CommentBox';
import RegisterFrom from './components/RegisterFrom';
import Login from './components/LoginFrom';
import{
  ControlledInput,
  UncontrolledInput,
  CommentBox,
  LoginFrom
} from './components'

function App(){
  return(
    <>
      <ControlledInput />
      <UncontrolledInput />
      <CommentBox/>
      <RegisterForm/>
    </>
  )
}

export default App;