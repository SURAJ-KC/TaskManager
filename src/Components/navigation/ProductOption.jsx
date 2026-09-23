import { useState } from "react";

export default function ProductOption() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button className="flex items-center gap-1"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}  
        >
        Products <span className={open ? "rotate-270 inline-block" : ""}>▼</span>
        
      </button>

      {open && (
        <div className="absolute top-full mt-2 w-36 bg-white border rounded shadow-md p-2 flex flex-col">
          <a href="#" className="p-1 hover:bg-gray-100 rounded">Electronic Devices</a>
          <a href="#" className="p-1 hover:bg-gray-100 rounded">Mobile Phones</a>
          <a href="#" className="p-1 hover:bg-gray-100 rounded">Styling</a>
          <a href="#" className="p-1 hover:bg-gray-100 rounded">Booking</a>
        </div>
      )}
    </div>
  );
}