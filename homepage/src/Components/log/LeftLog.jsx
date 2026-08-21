import SigninForm from "../form/SigninForm"


const LeftLog = () => {
  return (
    <div className="   backdrop-blur-md  w-7/12 h-full rounded-l-4xl flex flex-col itemss ">
           <h1 className="text-white font-extrabold text-5xl mt-20">Login </h1>
           <h1 className="text-white font-extrabold text-5xl mt-2 pr-10 pb-2">Page</h1>
           <SigninForm  />
      </div>
  )
}

export default LeftLog