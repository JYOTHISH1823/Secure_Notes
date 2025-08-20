import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Plus, Star, Clock, Edit } from "lucide-react";

interface IdeasProps {
  isAuthenticated: boolean;
  onLogin?: () => void;
}

export default function Ideas({ isAuthenticated, onLogin }: IdeasProps) {
  const ideas = [
    {
      id: 1,
      title: "AI-Powered Note Organization",
      description: "Automatically categorize and tag notes using machine learning to improve searchability and organization.",
      category: "tech",
      priority: "high",
      lastModified: "2 days ago",
      isStarred: true
    },
    {
      id: 2,
      title: "Collaborative Workspace Feature",
      description: "Allow multiple users to work on shared notes and projects while maintaining security for private content.",
      category: "feature",
      priority: "medium",
      lastModified: "1 week ago",
      isStarred: false
    },
    {
      id: 3,
      title: "Voice-to-Text Integration",
      description: "Add voice recording and transcription capabilities for quick note-taking on the go.",
      category: "accessibility",
      priority: "high",
      lastModified: "3 days ago",
      isStarred: true
    },
    {
      id: 4,
      title: "Mobile App Development",
      description: "Create native mobile applications for iOS and Android with offline synchronization support.",
      category: "mobile",
      priority: "low",
      lastModified: "2 weeks ago",
      isStarred: false
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      tech: "bg-blue-100 text-blue-800 border-blue-200",
      feature: "bg-green-100 text-green-800 border-green-200",
      accessibility: "bg-purple-100 text-purple-800 border-purple-200",
      mobile: "bg-orange-100 text-orange-800 border-orange-200"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <Lightbulb className="w-16 h-16 text-muted-foreground mx-auto" />
          <div>
            <h1 className="text-2xl font-bold">Ideas</h1>
            <p className="text-muted-foreground">
              Please sign in to access your ideas and brainstorming space.
            </p>
          </div>
          <Button onClick={onLogin}>Sign In to Continue</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ideas</h1>
          <p className="text-muted-foreground">
            Capture and develop your creative thoughts and concepts
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Idea
        </Button>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ideas.map((idea) => (
          <Card key={idea.id} className="hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  {idea.isStarred && (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  )}
                </div>
                <Button variant="ghost" size="icon">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              <CardTitle className="text-lg leading-6">{idea.title}</CardTitle>
              <CardDescription className="line-clamp-3">
                {idea.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className={getCategoryColor(idea.category)}>
                  {idea.category}
                </Badge>
                <Badge className={getPriorityColor(idea.priority)}>
                  {idea.priority} priority
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                Updated {idea.lastModified}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State for No Ideas */}
      {ideas.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No ideas yet</h3>
            <p className="text-muted-foreground mb-4">
              Start capturing your creative thoughts and innovative concepts.
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Idea
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Ideas</p>
                <p className="text-2xl font-bold text-primary">{ideas.length}</p>
              </div>
              <Lightbulb className="w-8 h-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Starred</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {ideas.filter(idea => idea.isStarred).length}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-red-600">
                  {ideas.filter(idea => idea.priority === 'high').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-500/20 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}