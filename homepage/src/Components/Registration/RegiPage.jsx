import Navbar from '../navigation/Navbar';
import LeftRegi from './LeftLRegi';
import RightRegi from './RightRegi';
const RegiPage = () => {
  return (
   <div>
    <Navbar />
     <div className=" backdrop-blur-md border border-white/20 mx-40 my-13 p-6 w-255 rounded-4xl  flex h-142 items-center">
      <LeftRegi />
     <RightRegi />
    </div>
   </div>
  )
}

export default RegiPage;