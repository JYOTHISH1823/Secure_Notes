import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge, Input, Button } from "@/components/ui";
import { Lightbulb, Star, Clock } from "lucide-react";

export default function IdeaCard({ idea, onAddFeedback }: { idea: any, onAddFeedback?: (id: string, comment: string) => void }) {
  const [comment, setComment] = useState("");

  const getCategoryColor = (category: string) => {
    const colors = { tech: "bg-blue-100 text-blue-800", feature: "bg-green-100 text-green-800", accessibility: "bg-purple-100 text-purple-800", mobile: "bg-orange-100 text-orange-800" };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const submitFeedback = () => {
    onAddFeedback?.(idea._id, comment);
    setComment("");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb />
          {idea.isStarred && <Star className="text-yellow-500" />}
        </div>
        <CardTitle>{idea.title}</CardTitle>
        <CardDescription>{idea.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Badge className={getCategoryColor(idea.category)}>{idea.category}</Badge>
        <div className="text-xs text-muted-foreground"><Clock /> {new Date(idea.createdAt).toLocaleDateString()}</div>

        {/* Feedback List */}
        {idea.feedback?.map((f: any, idx: number) => (
          <p key={idx} className="text-sm border-t pt-1">{f.comment}</p>
        ))}

        {/* Add Feedback */}
        <div className="flex gap-2 mt-2">
          <Input placeholder="Add feedback" value={comment} onChange={(e) => setComment(e.target.value)} />
          <Button onClick={submitFeedback}>Submit</Button>
        </div>
      </CardContent>
    </Card>
  );
}