import { useState } from "react";
import { Bot, Sparkles, FileText, MessageSquare, Code, Image, Zap, Wand2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Dialog } from "@headlessui/react";
import ReactMarkdown from "react-markdown";

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
  // ... same as before
];

const AIServices = ({ isAuthenticated, onLogin }: AIServicesProps) => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isImage, setIsImage] = useState(false);

  const filteredServices = selectedCategory === "all" 
    ? aiServices 
    : aiServices.filter(service => service.category === selectedCategory);

  const handleServiceClick = async (service: AIService) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access AI services.",
        variant: "destructive",
      });
      return;
    }

    if (service.status === "coming-soon") {
      toast({ title: "Coming Soon", description: `${service.name} will be available soon.` });
      return;
    }

    if (service.status === "premium") {
      toast({ title: "Premium Feature", description: `${service.name} requires premium.` });
      return;
    }

    // Open modal and show loading
    setIsModalOpen(true);
    setModalTitle(service.name);
    setModalContent("");
    setIsLoading(true);
    setIsImage(service.id === "image-generator");

    try {
      let prompt = "";
      switch (service.id) {
        case "text-generator":
          prompt = "Write a creative paragraph about AI in education.";
          break;
        case "chat-assistant":
          prompt = "Explain quantum computing in simple terms.";
          break;
        case "code-helper":
          prompt = "Write a JavaScript function to reverse a string.";
          break;
        case "image-generator":
          prompt = "Generate a fantasy landscape with mountains and rivers.";
          break;
        case "data-analyzer":
          prompt = "Analyze the following sales data: [CSV or JSON data]";
          break;
      }

      const res = await fetch("/api/ai/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, serviceId: service.id }),
      });

      const data = await res.json();

      if (service.id === "image-generator") {
        setModalContent(data.data[0].url);
      } else if (service.id === "code-helper") {
        setModalContent(data.choices[0].message.content);
      } else {
        setModalContent(data.choices ? data.choices[0].message.content : JSON.stringify(data, null, 2));
      }

    } catch (err: any) {
      setModalContent("Error: " + (err.message || "Something went wrong"));
    } finally {
      setIsLoading(false);
    }
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
        <Button onClick={onLogin}>Sign In to Continue</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-8 h-8 text-primary" />
          AI Services
        </h1>
        <p className="text-muted-foreground">Enhance your productivity with cutting-edge AI tools</p>
      </div>

      {/* Tabs */}
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
                      <h4 className="font-medium text-sm mb-2">Features:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
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

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full p-6 z-50 relative">
            <Dialog.Title className="text-xl font-bold mb-4">{modalTitle}</Dialog.Title>
            {isLoading ? (
              <p>Loading AI Response...</p>
            ) : isImage ? (
              <img src={modalContent} alt={modalTitle} className="w-full rounded" />
            ) : (
              <div className="max-h-96 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 rounded">
                <ReactMarkdown>{modalContent}</ReactMarkdown>
              </div>
            )}
            <Button className="mt-4" onClick={() => setIsModalOpen(false)}>Close</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AIServices;