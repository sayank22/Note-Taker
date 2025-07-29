import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { toast } from "react-toastify";

interface Note {
  _id: string;
  title: string;
  description: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isNotesLoading, setIsNotesLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editNoteId, setEditNoteId] = useState<string | null>(null); // null for add, id for edit

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (error) {
        console.error("User auth error:", error);
        navigate("/login");
      } finally {
        setIsUserLoading(false);
      }
    };

    const fetchNotes = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(res.data.notes || []);
      } catch (error) {
        console.warn("Notes API not ready yet, skipping...");
        setNotes([]);
      } finally {
        setIsNotesLoading(false);
      }
    };

    fetchUser();
    fetchNotes();
  }, [navigate, token]);

  const handleAddOrUpdateNote = async () => {
    if (!title.trim() || !description.trim()) return;

    try {
      if (editNoteId) {
        // Update note
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/notes/${editNoteId}`,
          { title, description },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setNotes((prev) =>
          prev.map((note) => (note._id === editNoteId ? res.data : note))
        );
        toast.success("Note updated successfully!");
      } else {
        // Create new note
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/notes`,
          { title, description },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setNotes((prev) => [res.data, ...prev]);
        toast.success("Note added successfully!");
      }

      setTitle("");
      setDescription("");
      setEditNoteId(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prev) => prev.filter((note) => note._id !== id));
      toast.success("Note deleted.");
    } catch (error) {
      console.error("Delete note error:", error);
      toast.error("Failed to delete note.");
    }
  };

  const handleEdit = (note: Note) => {
    setEditNoteId(note._id);
    setTitle(note.title);
    setDescription(note.description);
    setShowModal(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const obfuscateEmail = (email: string) => {
    const [name, domain] = email.split("@");
    return `${name.slice(0, 2)}****@${domain}`;
  };

  if (isUserLoading) return <div className="text-center mt-10">Loading user...</div>;
  if (!user) return <div className="text-center mt-10">Failed to load user.</div>;

  return (
   <div className="max-w-md mx-auto p-4 relative">
  <div className="md:absolute md:top-4 md:left-4 w-10 h-10 rounded-full bg-blue-400 mb-2 md:mb-0" />

  <div className="flex justify-between items-center mb-4">
    <h1 className="text-2xl font-semibold">Dashboard</h1>
    <button onClick={handleSignOut} className="text-blue-500 hover:underline">
      Sign Out
    </button>
  </div>
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <h2 className="text-lg font-bold mb-1">Welcome, {user.name}!</h2>
        <p className="text-sm text-gray-600">Email: {obfuscateEmail(user.email)}</p>
      </div>

      <button
        onClick={() => {
          setEditNoteId(null);
          setTitle("");
          setDescription("");
          setShowModal(true);
        }}
        className="w-full mb-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Create Note
      </button>

      <Dialog open={showModal} onClose={() => setShowModal(false)} className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="bg-white rounded-xl p-6 shadow-xl w-full max-w-md">
            <Dialog.Title className="text-lg font-bold mb-2">
              {editNoteId ? "Edit Note" : "New Note"}
            </Dialog.Title>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full border mb-3 px-3 py-2 rounded focus:outline-none"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full border mb-3 px-3 py-2 rounded focus:outline-none"
            ></textarea>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded border">
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdateNote}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {editNoteId ? "Update" : "Save"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <div>
        <h3 className="font-medium text-gray-800 mb-2">Notes</h3>
        {isNotesLoading ? (
          <p className="text-sm text-gray-500">Loading notes...</p>
        ) : !notes || notes.length === 0 ? (
          <p className="text-sm text-gray-500">No notes yet.</p>
        ) : (
          notes.map((note, index) => (
            <div
              key={note._id}
              className="bg-white border px-4 py-2 rounded-lg mb-2 shadow-sm"
            >
              <div className="text-xs text-gray-400 mb-1">Note {index + 1}</div>
              <div className="font-semibold">{note.title}</div>
              <div className="text-sm text-gray-600 mb-2">
                {note.description || "No description"}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(note)}
                  className="text-blue-500 hover:underline"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
