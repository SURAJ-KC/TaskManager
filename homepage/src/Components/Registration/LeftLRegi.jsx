import SignupForm from "../form/SignupForm";
import { Link } from "react-router-dom";

const LeftRegi = () => {
  return (
    <div className="w-full md:w-7/12 h-auto md:h-full backdrop-blur-md rounded-3xl md:rounded-l-4xl md:rounded-r-none flex flex-col justify-between p-6 sm:p-8 md:p-10 border-b md:border-b-0 md:border-r border-white/10">
      
      {/* Title */}
      <div className="flex flex-col mt-2 md:mt-4">
        <h1 className="text-white font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-none">
          Register
        </h1>
        <h1 className="text-white font-extrabold text-3xl sm:text-4xl lg:text-5xl mt-1 tracking-tight leading-none">
          Page
        </h1>
      </div>

      {/* Registration Form */}
      <div className="w-full mt-4 md:mt-6">
        <SignupForm />
      
      </div>

      {/* Link to Login */}
      <div className="mt-3 text-center">
        <p className="text-xs text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline">
            Log In
          </Link>
        </p>
      </div>

    </div>
  );
};

export default LeftRegi;