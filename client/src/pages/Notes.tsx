import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PasswordProtected } from "@/components/PasswordProtected";
import { 
  FileText, 
  Plus, 
  Search, 
  Lock, 
  Star,
  Clock,
  Edit,
  Trash2,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import API from "@/hooks/api";

interface NotesProps {
  isAuthenticated: boolean;
}

export default function Notes({ isAuthenticated }: NotesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState<any[]>([]);
  const [editingNote, setEditingNote] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // For creating new note
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const { toast } = useToast();

  // ✅ Fetch normal notes
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
    }
  }, [isAuthenticated]);

  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  // ==============================
  // 🔒 Secure Notes State & Methods
  // ==============================
  const [secureNotes, setSecureNotes] = useState<any[]>([]);
  const [sTitle, setSTitle] = useState("");
  const [sContent, setSContent] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      API.get("/notes/secure").then((res) => setSecureNotes(res.data));
    }
  }, [isAuthenticated]);

  const handleSecureCreate = async () => {
    if (!sTitle) return;
    const res = await API.post("/notes/secure", { title: sTitle, content: sContent });
    setSecureNotes([res.data, ...secureNotes]);
    setSTitle(""); 
    setSContent("");
  };

  const handleSecureEdit = async (note: any) => {
    const newTitle = prompt("Update title:", note.title);
    const newContent = prompt("Update content:", note.content);
    if (!newTitle) return;
    const res = await API.put(`/notes/secure/${note._id}`, { title: newTitle, content: newContent });
    setSecureNotes(secureNotes.map((n) => (n._id === note._id ? res.data : n)));
  };

  const handleSecureDelete = async (id: string) => {
    await API.delete(`/notes/secure/${id}`);
    setSecureNotes(secureNotes.filter((n) => n._id !== id));
  };

  // ==============================
  // Normal Note CRUD
  // ==============================
  const handleCreateNote = async () => {
    try {
      const res = await API.post("/notes", {
        title: newTitle,
        content: newContent,
      });
      setNotes([...notes, res.data]);
      toast({
        title: "Note Created",
        description: "Your new note has been created successfully.",
      });
      setCreating(false);
      setNewTitle("");
      setNewContent("");
    } catch (err) {
      console.error("Error creating note:", err);
      toast({
        title: "Error",
        description: "Could not create note",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await API.delete(`/notes/${noteId}`);
      setNotes(notes.filter((n) => n._id !== noteId));
      toast({
        title: "Note Deleted",
        description: "The note has been moved to trash.",
        variant: "destructive",
      });
    } catch (err) {
      console.error("Error deleting note:", err);
      toast({
        title: "Error",
        description: "Could not delete note",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (note: any) => {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleSaveEdit = async () => {
    if (!editingNote) return;
    try {
      const res = await API.put(`/notes/${editingNote._id}`, {
        title: editTitle,
        content: editContent,
      });
      setNotes(notes.map((n) => (n._id === editingNote._id ? res.data : n)));
      toast({ title: "Note Updated", description: "Your changes were saved." });
      setEditingNote(null);
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not update note",
        variant: "destructive",
      });
    }
  };

  // ✅ Search filter
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto" />
          <div>
            <h1 className="text-2xl font-bold">Secure Notes</h1>
            <p className="text-muted-foreground">
              Please sign in to access your notes and create new ones.
            </p>
          </div>
          <Button>Sign In to Continue</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
          <p className="text-muted-foreground">
            Create, organize, and secure your important information
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Normal Notes */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            My Notes
          </CardTitle>
          <CardDescription>
            Your regular notes and documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredNotes.length > 0 ? (
            <div className="grid gap-4">
              {filteredNotes.map((note) => (
                <Card key={note._id} className="hover:shadow-sm transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{note.title}</h3>
                          {note.isStarred && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {note.content}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {new Date(note.updatedAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(note)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteNote(note._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No notes found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 🔒 Secure Notes */}
      <Card className="shadow-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Secure Notes
          </CardTitle>
          <CardDescription>
            Password-protected private notes and sensitive information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordProtected
            title="Access Secure Notes"
            description="Enter your password to view and manage private, encrypted notes."
          >
            {/* Create secure note */}
            <div className="mb-4">
              <Input
                value={sTitle}
                onChange={(e) => setSTitle(e.target.value)}
                placeholder="Secure note title"
                className="mb-2"
              />
              <textarea
                value={sContent}
                onChange={(e) => setSContent(e.target.value)}
                placeholder="Write secure content..."
                className="w-full h-24 p-2 border rounded-md mb-2 bg-transparent"
              />
              <Button onClick={handleSecureCreate}>
                <Plus className="w-4 h-4 mr-2" /> Add Secure Note
              </Button>
            </div>

            {/* Secure notes list */}
            <div className="grid gap-4">
              {secureNotes.map((note) => (
                <Card key={note._id} className="border-destructive/20 bg-destructive/5">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <h3 className="font-medium">{note.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {note.content}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {new Date(note.updatedAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleSecureEdit(note)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleSecureDelete(note._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </PasswordProtected>
        </CardContent>
      </Card>

      {/* Create Note Modal */}
      {creating && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Create New Note</h2>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Note title"
              className="mb-3"
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Write your note..."
              className="w-full h-32 p-2 border rounded-md mb-4 bg-transparent"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateNote}>Create</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Note Modal */}
      {editingNote && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Edit Note</h2>
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Note title"
              className="mb-3"
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Write your note..."
              className="w-full h-32 p-2 border rounded-md mb-4 bg-transparent"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingNote(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}