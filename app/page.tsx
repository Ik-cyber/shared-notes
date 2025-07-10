"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Hash,
  Book,
  User,
  Eye,
  Share2,
} from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  author: string;
  views: number;
}

interface Subject {
  id: string;
  name: string;
}

// Utility functions
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const StudyNotesBlog: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [subjects] = useState<Subject[]>([
    { id: "1", name: "Mathematics" },
    { id: "2", name: "Physics" },
    { id: "3", name: "Chemistry" },
    { id: "4", name: "Computer Science" },
    { id: "5", name: "Biology" },
    { id: "6", name: "Economics" },
    { id: "7", name: "Engineering" },
  ]);

  const [showAddNote, setShowAddNote] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Form state
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteSubject, setNoteSubject] = useState("");
  const [noteTags, setNoteTags] = useState("");

  // Initialize with sample data
  useEffect(() => {
    const sampleNotes: Note[] = [
      {
        id: "1",
        title: "Introduction to Calculus",
        content:
          "Calculus is the mathematical study of continuous change. It has two main branches: differential calculus (concerning rates of change and slopes of curves) and integral calculus (concerning accumulation of quantities and areas under curves). These two branches are related to each other by the fundamental theorem of calculus.",
        subject: "Mathematics",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
        tags: ["calculus", "derivatives", "integrals"],
        author: "Study Admin",
        views: 42,
      },
      {
        id: "2",
        title: "Newton's Laws of Motion",
        content:
          "Newton's three laws of motion are fundamental principles that describe the relationship between forces acting on a body and its motion. First Law: An object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force. Second Law: F = ma. Third Law: For every action, there is an equal and opposite reaction.",
        subject: "Physics",
        createdAt: "2024-01-14T14:20:00Z",
        updatedAt: "2024-01-14T14:20:00Z",
        tags: ["mechanics", "force", "motion"],
        author: "Study Admin",
        views: 38,
      },
      {
        id: "3",
        title: "Organic Chemistry Basics",
        content:
          "Organic chemistry is the study of carbon-containing compounds. Carbon is unique because it can form four covalent bonds and create complex molecular structures. Key concepts include functional groups, isomerism, and reaction mechanisms.",
        subject: "Chemistry",
        createdAt: "2024-01-13T09:15:00Z",
        updatedAt: "2024-01-13T09:15:00Z",
        tags: ["organic", "carbon", "molecules"],
        author: "Study Admin",
        views: 29,
      },
    ];

    setNotes(sampleNotes);
  }, []);

  // Filter notes based on subject
  const filteredNotes = notes.filter((note) => {
    return selectedSubject === "" || note.subject === selectedSubject;
  });

  // Handle viewing a note
  const handleViewNote = (note: Note) => {
    // Increment view count
    setNotes(
      notes.map((n) => (n.id === note.id ? { ...n, views: n.views + 1 } : n)),
    );
    setSelectedNote(note);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;

    const noteData = {
      title: noteTitle.trim(),
      content: noteContent.trim(),
      subject: noteSubject || "General",
      tags: noteTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
      author: "Study Admin",
      views: 0,
    };

    if (editingNote) {
      // Update existing note
      setNotes(
        notes.map((note) =>
          note.id === editingNote.id
            ? { ...note, ...noteData, updatedAt: new Date().toISOString() }
            : note,
        ),
      );
      setEditingNote(null);
    } else {
      // Add new note
      const newNote: Note = {
        ...noteData,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes([newNote, ...notes]);
    }

    resetForm();
  };

  // Handle edit note
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteSubject(note.subject);
    setNoteTags(note.tags.join(", "));
    setShowAddNote(true);
  };

  // Handle delete note
  const handleDeleteNote = (id: string) => {
    if (window.confirm("Delete this note?")) {
      setNotes(notes.filter((note) => note.id !== id));
    }
  };

  // Reset form
  const resetForm = () => {
    setShowAddNote(false);
    setEditingNote(null);
    setNoteTitle("");
    setNoteContent("");
    setNoteSubject("");
    setNoteTags("");
  };

  // Share note
  const handleShare = (note: Note) => {
    if (navigator.share) {
      navigator.share({
        title: note.title,
        text: truncateText(note.content, 100),
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
      alert("Note copied to clipboard!");
    }
  };

  // Single note view
  if (selectedNote) {
    return (
      <div
        className="min-h-screen text-white"
        style={{ backgroundColor: "#3d3d3d" }}
      >
        <header
          className="border-b border-gray-600"
          style={{ backgroundColor: "#2d2d2d" }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={() => setSelectedNote(null)}
              className="text-gray-300 hover:text-white mb-4 flex items-center gap-2"
            >
              ← Back to Notes
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {selectedNote.title}
                </h1>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-300">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {selectedNote.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(selectedNote.updatedAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {selectedNote.views} views
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare(selectedNote)}
                  className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-lg transition-all duration-200"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                {isAdmin && (
                  <>
                    <button
                      onClick={() => handleEditNote(selectedNote)}
                      className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-lg transition-all duration-200"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(selectedNote.id)}
                      className="p-2 text-gray-300 hover:text-red-400 hover:bg-gray-600 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div
            className="border border-gray-600 rounded-xl p-8"
            style={{ backgroundColor: "#2d2d2d" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-gray-600 text-white rounded-full text-sm font-medium">
                {selectedNote.subject}
              </span>
              {selectedNote.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-blue-600 text-white rounded-md text-xs"
                >
                  <Hash className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                {selectedNote.content}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-white"
      style={{ backgroundColor: "#3d3d3d" }}
    >
      {/* Header */}
      <header
        className="border-b border-gray-600 sticky top-0 z-40"
        style={{ backgroundColor: "#2d2d2d" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Study Notes Blog
              </h1>
              <p className="text-gray-300 mt-2">
                Shared knowledge for our coursemates
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-300">
                {notes.length} note{notes.length !== 1 ? "s" : ""} published
              </div>
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isAdmin
                    ? "bg-blue-600 text-white"
                    : "bg-gray-600 text-gray-200 hover:bg-gray-500"
                }`}
              >
                {isAdmin ? "Admin Mode" : "View Mode"}
              </button>
            </div>
          </div>

          {/* Subject Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedSubject("")}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedSubject === ""
                  ? "bg-white text-gray-900"
                  : "bg-gray-600 text-gray-200 hover:bg-gray-500"
              }`}
            >
              All Subjects
            </button>
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject.name)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedSubject === subject.name
                    ? "bg-white text-gray-900"
                    : "bg-gray-600 text-gray-200 hover:bg-gray-500"
                }`}
              >
                {subject.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Note Form */}
        {showAddNote && isAdmin && (
          <div
            className="border border-gray-600 rounded-xl p-6 mb-8"
            style={{ backgroundColor: "#2d2d2d" }}
          >
            <h2 className="text-xl font-semibold mb-6 text-white">
              {editingNote ? "Edit Note" : "Publish New Note"}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Note title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <textarea
                placeholder="Write your note content..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  value={noteSubject}
                  onChange={(e) => setNoteSubject(e.target.value)}
                  className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  value={noteTags}
                  onChange={(e) => setNoteTags(e.target.value)}
                  className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-white text-gray-900 font-medium py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
                >
                  {editingNote ? "Update Note" : "Publish Note"}
                </button>
                <button
                  onClick={resetForm}
                  className="bg-gray-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-500 transition-all duration-200 border border-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Book className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                {selectedSubject
                  ? `No ${selectedSubject} notes yet`
                  : "No notes published yet"}
              </h3>
              <p className="text-gray-300 text-base mb-6">
                {selectedSubject
                  ? "No notes available for this subject"
                  : "Check back later for new study materials"}
              </p>
              {isAdmin && (
                <button
                  onClick={() => setShowAddNote(true)}
                  className="bg-white text-gray-900 font-medium py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
                >
                  Publish First Note
                </button>
              )}
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className="border border-gray-600 rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer"
                style={{ backgroundColor: "#2d2d2d" }}
                onClick={() => handleViewNote(note)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-3 leading-tight hover:text-blue-400 transition-colors">
                      {note.title}
                    </h3>
                    <div className="flex flex-col gap-2 text-sm text-gray-300">
                      <span className="px-3 py-1 bg-gray-600 text-white rounded-full w-fit text-xs font-medium">
                        {note.subject}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {note.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {note.views}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(note.updatedAt)}
                      </span>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditNote(note);
                        }}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-all duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-gray-200 mb-4 leading-relaxed text-sm">
                  {truncateText(note.content, 120)}
                </p>

                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {note.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-blue-600 text-white rounded-md text-xs"
                      >
                        <Hash className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="text-xs text-gray-400 py-1">
                        +{note.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      {!showAddNote && isAdmin && (
        <button
          onClick={() => setShowAddNote(true)}
          className="fixed bottom-6 right-6 bg-white text-gray-900 rounded-full p-4 shadow-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-110 z-50"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default StudyNotesBlog;
