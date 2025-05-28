
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ChefHat } from "lucide-react";
import { signInUser } from "@/services/firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInUser(email, password);
      toast.success("Connexion réussie");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      
      let errorMessage = "Échec de la connexion. Veuillez vérifier vos identifiants.";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "Aucun utilisateur trouvé avec cet email.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Mot de passe incorrect.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Adresse email invalide.";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-restaurant-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <ChefHat size={40} className="text-restaurant-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-restaurant-primary">Bienvenue</CardTitle>
          <CardDescription>
            Connectez-vous pour accéder au tableau de bord
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@restaurant.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de Passe</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button 
              type="submit" 
              className="w-full bg-restaurant-primary hover:bg-restaurant-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "Se Connecter"}
            </Button>
            <div className="mt-4 text-center">
              <p className="text-sm">
                Pas encore de compte?{" "}
                <a 
                  href="/signup" 
                  className="text-restaurant-primary hover:underline"
                >
                  Créer un compte
                </a>
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
