import { useState, ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PasswordProtectedProps {
  children: ReactNode;
  title?: string;
  description?: string;
  correctPassword?: string;
}

export function PasswordProtected({ 
  children, 
  title = "Enter Password",
  description = "This section is password protected. Please enter the password to continue.",
  correctPassword = "secure123"
}: PasswordProtectedProps) {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate password verification
    setTimeout(() => {
      if (password === correctPassword) {
        setIsUnlocked(true);
        toast({
          title: "Access granted",
          description: "Welcome to the secure section.",
        });
      } else {
        toast({
          title: "Incorrect password",
          description: "Please check your password and try again.",
          variant: "destructive",
        });
        setPassword("");
      }
      setIsLoading(false);
    }, 800);
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Demo password: <code className="bg-muted px-1 py-0.5 rounded">secure123</code>
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Unlock"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}