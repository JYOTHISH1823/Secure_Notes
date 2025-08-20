import { useState } from "react";
import { AppSidebar } from "../components/AppSidebar";
import { FileSearchBar } from "@/components/shared/FileSearchBar";
import { FileItem } from "../components/shared/FileItem";
import { Button } from "@/components/ui/button";
import { Filter, Grid, List, FileText, Shield } from "lucide-react";

interface SharedFilesProps {
  isAuthenticated: boolean;
  onLogin: () => void;
}

const mockFiles = [
  {
    id: "1",
    title: "Project Report",
    type: "pdf",
    sharedBy: "Alice",
    sharedDate: "2025-08-15",
    size: "2.3 MB",
  },
  {
    id: "2",
    title: "Team Notes",
    type: "docx",
    sharedBy: "Bob",
    sharedDate: "2025-08-12",
    size: "1.1 MB",
  },
];

export const SharedFiles = ({ isAuthenticated, onLogin }: SharedFilesProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const filteredFiles = mockFiles.filter(
    (file) =>
      file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.sharedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShare = (id: string) => {
    if (!isAuthenticated) {
      onLogin();
    } else {
      console.log("Sharing file:", id);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col h-screen items-center">
        <div className="text-center py-12">
          <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
          <p className="text-muted-foreground">
            Please sign in to access shared files.
          </p>
          <Button onClick={onLogin}>Sign In to Continue</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <AppSidebar
        isAuthenticated={isAuthenticated}
        user={{ name: "John Doe", email: "john@example.com" }}
        onLogin={onLogin}
        onLogout={() => console.log("Logout")}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-surface-elevated px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">
                Shared Files
              </h1>
              <p className="text-text-secondary">
                Files and documents shared with you
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Content */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Search Bar */}
            <div className="max-w-md">
              <FileSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search shared files..."
              />
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-text-secondary">
                {filteredFiles.length} file
                {filteredFiles.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {/* Files List / Grid */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
              }
            >
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file) => (
                  <FileItem
                    key={file.id}
                    id={file.id}
                    title={file.title}
                    type={file.type}
                    sharedBy={file.sharedBy}
                    sharedDate={file.sharedDate}
                    size={file.size}
                    onShare={handleShare}
                  />
                ))
              ) : (
                <div className="text-center py-12 col-span-full">
                  <div className="w-12 h-12 bg-brand-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-6 h-6 text-brand-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">
                    No files found
                  </h3>
                  <p className="text-text-secondary">
                    {searchQuery
                      ? "Try adjusting your search terms"
                      : "No files have been shared with you yet"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};