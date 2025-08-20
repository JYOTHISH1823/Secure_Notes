import { useState } from "react";
import { Bot, Zap, MessageSquare, FileText, Image, Code, Wand2, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface AIServicesProps {
  isAuthenticated: boolean;
  onLogin?: () => void;
}

interface AIService {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "text" | "image" | "code" | "analysis";
  status: "available" | "premium" | "coming-soon";
  features: string[];
}

const aiServices: AIService[] = [
  {
    id: "text-generator",
    name: "Text Generator",
    description: "Generate high-quality content, summaries, and creative writing",
    icon: FileText,
    category: "text",
    status: "available",
    features: ["Content creation", "Summarization", "Creative writing", "Email drafts"]
  },
  {
    id: "chat-assistant",
    name: "Chat Assistant",
    description: "Intelligent conversational AI for questions and assistance",
    icon: MessageSquare,
    category: "text",
    status: "available",
    features: ["Q&A support", "Research help", "Planning assistance", "Brainstorming"]
  },
  {
    id: "code-helper",
    name: "Code Assistant",
    description: "AI-powered code generation, debugging, and optimization",
    icon: Code,
    category: "code",
    status: "premium",
    features: ["Code generation", "Bug fixing", "Code review", "Documentation"]
  },
  {
    id: "image-generator",
    name: "Image Creator",
    description: "Generate stunning images and artwork from text descriptions",
    icon: Image,
    category: "image",
    status: "premium",
    features: ["Text-to-image", "Style transfer", "Image editing", "Logo creation"]
  },
  {
    id: "data-analyzer",
    name: "Data Analyzer",
    description: "Analyze and visualize your data with AI insights",
    icon: Zap,
    category: "analysis",
    status: "coming-soon",
    features: ["Data visualization", "Trend analysis", "Report generation", "Predictions"]
  },
  {
    id: "content-optimizer",
    name: "Content Optimizer",
    description: "Optimize your content for SEO and engagement",
    icon: Wand2,
    category: "text",
    status: "coming-soon",
    features: ["SEO optimization", "Readability analysis", "Tone adjustment", "A/B testing"]
  }
];

const AIServices = ({ isAuthenticated, onLogin }: AIServicesProps) => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredServices = selectedCategory === "all" 
    ? aiServices 
    : aiServices.filter(service => service.category === selectedCategory);

  const handleServiceClick = (service: AIService) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access AI services.",
        variant: "destructive",
      });
      return;
    }

    if (service.status === "coming-soon") {
      toast({
        title: "Coming Soon",
        description: `${service.name} will be available soon. Stay tuned!`,
      });
      return;
    }

    if (service.status === "premium") {
      toast({
        title: "Premium Feature",
        description: `${service.name} requires a premium subscription.`,
      });
      return;
    }

    toast({
      title: "Service Launched",
      description: `${service.name} is now ready to use!`,
    });
  };

  const getStatusBadge = (status: AIService["status"]) => {
    switch (status) {
      case "available":
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Available</Badge>;
      case "premium":
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">Premium</Badge>;
      case "coming-soon":
        return <Badge variant="outline">Coming Soon</Badge>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <Bot className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">AI Services</h1>
        <p className="text-muted-foreground mb-4">Unlock the power of AI for your productivity</p>
        <p className="text-sm text-muted-foreground">Please sign in to access AI services.</p>
        <br />
        <Button onClick={onLogin}>Sig In to Continue</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-8 h-8 text-primary" />
          AI Services
        </h1>
        <p className="text-muted-foreground">Enhance your productivity with cutting-edge AI tools</p>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card 
                  key={service.id} 
                  className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                  onClick={() => handleServiceClick(service)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <IconComponent className="w-8 h-8 text-primary" />
                      {getStatusBadge(service.status)}
                    </div>
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Features:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {service.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button 
                        className="w-full" 
                        variant={service.status === "available" ? "default" : "outline"}
                        disabled={service.status === "coming-soon"}
                      >
                        {service.status === "available" && "Use Now"}
                        {service.status === "premium" && "Upgrade to Access"}
                        {service.status === "coming-soon" && "Coming Soon"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <Bot className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No services found</h3>
          <p className="text-muted-foreground">Try selecting a different category.</p>
        </div>
      )}
    </div>
  );
};

export default AIServices;