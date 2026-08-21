import istok1 from '../../assets/istok1.jpg'
const Section1 = () => {
  return (
    <div className=" bg-blue-100  max-h-svh my-8 mx-12 rounded-3xl place-items-center flex flex-col p-6"
   >
      <p className="mt-20  text-blue-400 font-bold text-2xl">Unleash Your Genius</p>
      <h1 className="mt-5 text-3xl font-extrabold">Turn Your Data into Beautifull,</h1>
      <h1 className="mt-3 text-3xl font-extrabold">Task Manager.</h1>
      <img className="mt-20  h-73 w-full max-w-6xl  object-cover  rounded-2xl shadow-2xl" src={istok1} alt="image "  />
    </div>
  )
}

export default Section1;