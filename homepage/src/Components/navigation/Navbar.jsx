import { Link } from 'react-router-dom';
import { Search, CalendarCheck2 } from 'lucide-react';
import Dropdown_more from './MoreOption';
import Dropdown_product from './ProductOption';




const Navbar = () => {
  return (
     <>
    <div className="flex   bg-blue-50 justify-between items-center px-8 py-4 text-xs" >
      <div className="flex gap-2">
       {/* <img className='h-8 flex' src={logo} alt="logo" /> */}
       <h1 className='text-green-500 mt-1'><CalendarCheck2 /></h1>
       <h1 className='text-2xl font-extrabold'>Task Manager</h1>
      </div>
      <ul className="flex gap-9 ml-60">
        
       <li><Link className="bg-blue-400 text-white p-2 rounded" to="/">Home</Link></li>
       <li ><Dropdown_product /></li>
      <li><Link className="bg-blue-400 text-white p-2 rounded" to="/dashboard">Dashboard</Link></li>
       <li><a href="#">Conusumer</a></li>
       <li><Dropdown_more /></li>
     </ul>
     <div className="flex gap-10">
      <a className=" p-1 rounded" href="#"><Search /></a>
      <Link className="bg-blue-400 text-white p-2 rounded" to="/login">Login</Link>
      <Link className="bg-blue-400 text-white p-2 rounded" to="/register">Register</Link>
     
     </div>
    </div>
    

    
    </>
  )
}

export default Navbar;