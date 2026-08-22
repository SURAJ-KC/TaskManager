import istok1 from '../../assets/istok1.jpg';

const Section1 = () => {
  return (
    
    <div className="bg-blue-100 min-h-fit my-4 sm:my-8 mx-4 sm:mx-8 md:mx-12 rounded-2xl sm:rounded-3xl flex flex-col items-center p-4 sm:p-6 md:p-10 text-center">
      
      {/* Subheading */}
      <p className="mt-6 sm:mt-12 md:mt-16 text-blue-500 font-bold text-lg sm:text-xl md:text-2xl">
        Unleash Your Genius
      </p>

      {/* Main Heading */}
      <h1 className="mt-2 sm:mt-4 text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
        Turn Your Data into Beautiful,
      </h1>
      <h1 className="mt-1 sm:mt-2 text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
        Task Manager.
      </h1>

      {/* Hero Image */}
      <div className="w-full max-w-5xl mt-8 sm:mt-12 md:mt-16">
        <img 
          className="h-48 sm:h-72 md:h-96 lg:h-100 w-full object-cover rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl" 
          src={istok1} 
          alt="Task Manager Dashboard Preview" 
        />
      </div>

    </div>
  );
};

export default Section1;