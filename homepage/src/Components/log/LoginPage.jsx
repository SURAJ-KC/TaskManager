import Navbar from '../navigation/Navbar';
import LeftLog from './LeftLog'
import RightLog from './RightLog';
const LoginPage = () => {
  return (
    <div>
      <Navbar />
    <div className=" backdrop-blur-md border border-white/20 mx-40 my-13 p-6 w-255 rounded-4xl  flex h-142 items-center">
    <LeftLog />
    <RightLog />
    </div>
    </div>
  )
}

export default LoginPage;