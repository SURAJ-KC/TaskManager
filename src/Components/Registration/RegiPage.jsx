import Navbar from '../navigation/Navbar';
import LeftRegi from './LeftLRegi';
import RightRegi from './RightRegi';
const RegiPage = () => {
  return (
   <div className="mx-auto w-full max-w-full">
    <Navbar />
     <div className="backdrop-blur-md border border-white/20 mx-auto my-6 md:my-13 p-4 sm:p-6 w-full max-w-255 rounded-3xl sm:rounded-4xl flex flex-col md:flex-row min-h-142 md:h-142 items-center justify-between gap-6">
      <LeftRegi />
     <RightRegi />
    </div>
   </div>
  )
}

export default RegiPage;