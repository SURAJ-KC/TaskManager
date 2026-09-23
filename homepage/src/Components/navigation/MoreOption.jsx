import { useState } from "react";

export default function MoreOption() {

  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onMouseOver={() => setOpen(!open)} className="flex items-center gap-1">
        More <span className={open ? "rotate-270 inline-block" : ""}>▼</span>
      </button>

      {open && ( 
        <div className=" absolute top-full mt-2 w-36 bg-white border rounded shadow-md p-2 flex flex-col">
          <a href="#" className="p-1 hover:bg-gray-100 rounded">Settings</a>
          <a href="#" className="p-1 hover:bg-gray-100 rounded">Analytics</a>
        </div>
      )}
    </div>
  );
}