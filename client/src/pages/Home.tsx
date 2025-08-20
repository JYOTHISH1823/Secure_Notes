import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Calendar, 
  Lock, 
  Shield, 
  Lightbulb,
  Plus,
  Clock,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";

interface HomeProps {
  isAuthenticated: boolean;
}

export default function Home({ isAuthenticated }: HomeProps) {
  const recentNotes = [
    {
      id: 1,
      title: "Project Ideas Brainstorm",
      preview: "Working on secure note-taking app with modern design...",
      lastModified: "2 hours ago",
      isSecure: true
    },
    {
      id: 2,
      title: "Meeting Notes - Q4 Planning",
      preview: "Discussion about upcoming features and roadmap...",
      lastModified: "Yesterday",
      isSecure: false
    },
    {
      id: 3,
      title: "Personal Development Goals",
      preview: "Learning new technologies and skill improvement...",
      lastModified: "3 days ago",
      isSecure: true
    }
  ];

  const quickActions = [
    {
      title: "New Note",
      description: "Create a new secure note",
      icon: FileText,
      href: "/notes",
      color: "bg-primary"
    },
    {
      title: "View Calendar",
      description: "Check your schedule",
      icon: Calendar,
      href: "/calendar",
      color: "bg-secondary"
    },
    {
      title: "Browse Ideas",
      description: "Explore your saved ideas",
      icon: Lightbulb,
      href: "/ideas",
      color: "bg-accent"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{isAuthenticated ? "!" : " to SecureNotes"}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isAuthenticated 
            ? "Here's what's happening with your secure notes today." 
            : "Your secure and private note-taking platform."
          }
        </p>
      </div>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.href}>
              <Card className="hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-2`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Feature Highlights */}
      {!isAuthenticated && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Why Choose SecureNotes?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>End-to-End Security</CardTitle>
                <CardDescription>
                  Your notes are encrypted and protected with advanced security measures.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>Password Protection</CardTitle>
                <CardDescription>
                  Additional password layers for your most sensitive information.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      )}

      {/* Recent Notes */}
      {isAuthenticated && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Notes</h2>
            <Link to="/notes">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </Button>
            </Link>
          </div>
          <div className="grid gap-4">
            {recentNotes.map((note) => (
              <Card key={note.id} className="hover:shadow-card transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{note.title}</h3>
                        {note.isSecure && (
                          <Lock className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{note.preview}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {note.lastModified}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Call to Action */}
      {!isAuthenticated && (
        <section className="text-center py-12">
          <Card className="max-w-2xl mx-auto shadow-elegant bg-primary text-white">
            <CardHeader className="space-y-4">
              <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
              <CardDescription className="text-white/80">
                Join thousands of users who trust SecureNotes with their private information.
                Start organizing your thoughts securely today.
              </CardDescription>
              <div className="pt-4">
                <Button variant="outline" size="lg" className="bg-white text-primary hover:bg-white/90">
                  Sign Up Now
                </Button>
              </div>
            </CardHeader>
          </Card>
        </section>
      )}
    </div>
  );
}