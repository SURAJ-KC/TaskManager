import SigninForm from "../form/SigninForm";

const LeftLog = () => {
  return (
    <div className="w-full md:w-7/12 h-auto md:h-full backdrop-blur-md rounded-3xl md:rounded-l-4xl md:rounded-r-none flex flex-col items-start justify-start p-6 sm:p-8 md:p-10 border-b md:border-b-0 md:border-r border-white/10">
      <div className="flex flex-col mt-2 md:mt-8">
        <h1 className="text-white font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-none">
          Login
        </h1>
        <h1 className="text-white font-extrabold text-3xl sm:text-4xl lg:text-5xl mt-1 tracking-tight leading-none">
          Page
        </h1>
      </div>

      <div className="w-full mt-6 md:mt-8">
        <SigninForm />

      </div>
    </div>
  );
};

export default LeftLog;