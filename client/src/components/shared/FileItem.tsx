import { Share2, FileText, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FileItemProps {
  id: string;
  title: string;
  type: "note" | "document" | "calendar";
  sharedBy: string;
  sharedDate: string;
  size?: string;
  onShare: (id: string) => void;
}

const getFileIcon = (type: string) => {
  switch (type) {
    case "note":
      return FileText;
    case "calendar":
      return Calendar;
    default:
      return FileText;
  }
};

export const FileItem = ({
  id,
  title,
  type,
  sharedBy,
  sharedDate,
  size,
  onShare,
}: FileItemProps) => {
  const Icon = getFileIcon(type);

  return (
    <Card className="p-4 bg-surface-card border-border/60 hover:border-primary/40 hover:shadow-sm transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-brand-secondary rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-brand-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-text-primary truncate">{title}</h3>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span>Shared by {sharedBy}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{sharedDate}</span>
              </div>
              {size && (
                <>
                  <span>•</span>
                  <span>{size}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onShare(id)}
          className="text-text-secondary hover:text-brand-primary hover:bg-brand-secondary"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};