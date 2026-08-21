import { useEffect, useState } from "react";

const RightRegi = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Fetch registered users from MongoDB on component mount
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Delete user by MongoDB _id
  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Failed to delete user");
        return;
      }

      // Remove deleted user from state UI
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Error deleting user from database");
    }
  };

  return (
    <div className="backdrop-blur-md w-5/12 h-full rounded-r-4xl flex flex-col items-center">
      <h1 className="mt-20 bg-black text-white font-extrabold text-1xl p-4 rounded-4xl">
        Welcome to Registration
      </h1>

      <ul className="w-7/12 p-4 border border-white/20 rounded-2xl text-xs mt-15 text-white list-none flex flex-col gap-2">
        {loading && <li className="text-center p-2">Loading users...</li>}

        {error && <li className="text-red-400 text-center p-2">{error}</li>}

        {!loading && !error && users.length === 0 && (
          <li className="text-center p-2">No registered users found.</li>
        )}

        {!loading &&
          users.map((user) => (
            <li
              key={user._id} // Fixed invalid nested <li> syntax and using MongoDB _id
              className="border flex flex-col gap-1 border-white/20 p-2 rounded bg-black/20"
            >
              <div className="font-semibold text-sm">
                {user.username || `${user.firstname || ""} ${user.lastname || ""}`.trim()}
              </div>
              <div className="text-gray-300">{user.email}</div>
              {user.phone && <div className="text-gray-400">{user.phone}</div>}

              <button
                type="button"
                onClick={() => handleDelete(user._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded self-end text-xs mt-1 cursor-pointer transition-colors"
              >
                Delete
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default RightRegi;