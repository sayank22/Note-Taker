import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type Note = {
  _id: string;
  content: string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserAndNotes = async () => {
      try {
        const res = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);

        const notesRes = await axios.get("/api/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(notesRes.data.notes);
      } catch (error) {
        console.error("Auth error:", error);
        navigate("/login");
      }
    };

    fetchUserAndNotes();
  }, [navigate, token]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      const res = await axios.post(
        "/api/notes",
        { content: newNote },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setNotes((prev) => [res.data.note, ...prev]);
      setNewNote("");
    } catch (error) {
      console.error("Add note error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button onClick={handleSignOut} className="text-blue-500 hover:underline">
          Sign Out
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <h2 className="text-lg font-bold mb-1">Welcome, {user.name}!</h2>
        <p className="text-sm text-gray-600">Email: {user.email}</p>
      </div>

      <div className="relative mb-4">
        <input
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a new note..."
          className="w-full border border-gray-300 rounded-full px-4 py-2 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        />
        <button
          onClick={handleAddNote}
          className="absolute right-1 top-1 bottom-1 bg-blue-500 text-white px-4 rounded-full hover:bg-blue-600 transition"
        >
          Create
        </button>
      </div>

      <div>
        <h3 className="font-medium text-gray-800 mb-2">Notes</h3>
        {notes.length === 0 ? (
          <p className="text-sm text-gray-500">No notes yet.</p>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              className="flex justify-between items-center bg-white border px-4 py-2 rounded-lg mb-2 shadow-sm"
            >
              <span>{note.content}</span>
              <button
                onClick={() => handleDelete(note._id)}
                className="text-red-500 hover:text-red-700"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
