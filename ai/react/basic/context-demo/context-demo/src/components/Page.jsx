import Child from './Child';
import {useTheme} from '../hooks/useTheme';
const Page=()=>{
    const theme = useTheme();
    console.log(theme);
    return(
        <>
        Page{theme}
        <br />
        <Child/>
        </>
    )

}

export default Page;