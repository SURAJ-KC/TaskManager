import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { getValidToken, logoutUser } from "../../Utils/auth";

// Dynamic API Base URL targeting live Render backend
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://taskmanager-1dan.onrender.com/api";

const RightLog = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // ✏️ Edit state management
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  });

  // Pure state derivation: Decode username directly from token on render without setState
  const userName = useMemo(() => {
    const token = getValidToken();
    if (!token) return "";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload?.user?.username || "";
    } catch {
      return "";
    }
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      const token = getValidToken();

      if (!token) {
        setError("Session expired or token missing. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/contacts`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setContacts(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        if (err.response?.status === 401) {
          logoutUser();
          return;
        }
        setError(err.response?.data?.message || err.message || "Failed to fetch contacts");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // 🗑️ DELETE Handler
  const handleDelete = async (id) => {
    const token = getValidToken();
    if (!token) return alert("Session expired.");

    try {
      setDeletingId(id);
      await axios.delete(`${API_BASE_URL}/contacts/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      if (err.response?.status === 401) {
        logoutUser();
        return;
      }
      alert(err.response?.data?.message || "Failed to delete contact");
    } finally {
      setDeletingId(null);
    }
  };

  // ✏️ Start Editing: Populate state with chosen contact details
  const handleStartEdit = (contact) => {
    setEditingId(contact._id);
    setEditFormData({
      firstname: contact.firstname || "",
      lastname: contact.lastname || "",
      email: contact.email || "",
      phone: contact.phone || "",
    });
  };

  // ✏️ Handle Form Inputs during editing
  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  // ✏️ Save Updated Contact (PUT /api/contacts/:id)
  const handleSaveEdit = async (id) => {
    const token = getValidToken();
    if (!token) return alert("Session expired.");

    try {
      const response = await axios.put(
        `${API_BASE_URL}/contacts/${id}`,
        editFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedContact = response.data;

      // Update state in real-time
      setContacts((prev) =>
        prev.map((contact) => (contact._id === id ? updatedContact : contact))
      );
      setEditingId(null); // Exit edit mode
    } catch (err) {
      if (err.response?.status === 401) {
        logoutUser();
        return;
      }
      alert(err.response?.data?.message || "Failed to update contact");
    }
  };

  return (
    <div className="glass-card w-full rounded-2xl p-4 sm:p-6 flex flex-col gap-4 max-h-162.5">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <h2 className="text-base sm:text-lg font-bold text-white capitalize">
          {userName ? `Welcome, ${userName}` : "Your Saved Contacts"}
        </h2>
        <span className="text-xs bg-indigo-500/20 text-white border border-indigo-500/30 px-3 py-1 rounded-full font-mono">
          {contacts.length} {contacts.length === 1 ? "Contact" : "Contacts"}
        </span>
      </div>

      <div className="overflow-y-auto pr-1 flex-1">
        {loading && (
          <div className="text-center py-10 text-slate-400 text-sm animate-pulse">
            Loading your contact list...
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center text-red-300 text-xs sm:text-sm">
            {error}
          </div>
        )}

        {!loading && !error && contacts.length === 0 && (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-xl text-slate-400 text-xs sm:text-sm">
            No contacts stored yet. Add a contact using the form!
          </div>
        )}

        {!loading && !error && contacts.length > 0 && (
          <ul className="flex flex-col gap-3">
            {contacts.map((contact) => (
              <li
                key={contact._id}
                className="p-3 sm:p-4 text-white rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col gap-3"
              >
                {/* 📝 CONDITIONAL EDIT MODE */}
                {editingId === contact._id ? (
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        name="firstname"
                        value={editFormData.firstname}
                        onChange={handleEditChange}
                        className="glass-input p-1.5 rounded text-xs"
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        name="lastname"
                        value={editFormData.lastname}
                        onChange={handleEditChange}
                        className="glass-input p-1.5 rounded text-xs"
                        placeholder="Last Name"
                      />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditChange}
                      className="glass-input p-1.5 rounded text-xs"
                      placeholder="Email"
                    />
                    <input
                      type="text"
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleEditChange}
                      className="glass-input p-1.5 rounded text-xs"
                      placeholder="Phone"
                    />

                    <div className="flex gap-2 justify-end mt-1">
                      <button
                        onClick={() => handleSaveEdit(contact._id)}
                        className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded text-xs cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 bg-slate-500/20 hover:bg-slate-500/30 text-slate-300 border border-slate-500/30 rounded text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 👁️ VIEW MODE */
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="font-semibold text-sm sm:text-base text-white capitalize truncate">
                        {contact.firstname} {contact.lastname}
                      </span>
                      <span className="text-xs text-slate-300 truncate">
                        {contact.email}
                      </span>
                      {contact.phone && (
                        <span className="text-xs text-slate-400 font-mono">
                          {contact.phone}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEdit(contact)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/25 text-xs font-medium cursor-pointer transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(contact._id)}
                        disabled={deletingId === contact._id}
                        className="px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-300 border border-red-500/25 text-xs font-medium cursor-pointer transition-all disabled:opacity-50"
                      >
                        {deletingId === contact._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RightLog;