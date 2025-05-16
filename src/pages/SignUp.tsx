
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ChefHat } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
 
  const [managerCode, setManagerCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation de base
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }

    // Vérification du code manager (dans un vrai système, ceci serait vérifié côté serveur)
    if (managerCode !== "MANAGER2024") {
      toast.error("Code manager invalide.");
      setIsLoading(false);
      return;
    }

    try {
      // Simulation d'enregistrement Firebase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Compte créé avec succès!");
      navigate("/login");
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      toast.error("Échec de l'inscription. Veuillez réessayer.");
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
          <CardTitle className="text-2xl font-bold text-restaurant-primary">Créer un Compte</CardTitle>
          <CardDescription>
            Inscrivez-vous pour accéder au système
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignUp}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  placeholder="Fares"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  placeholder="Cherif"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                placeholder="fares.cherif"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Adresse Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="fares.cherif@example.dz"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Mot de Passe</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            
            
            
            {(
              <div className="space-y-2">
                <Label htmlFor="managerCode">Code Manager</Label>
                <Input
                  id="managerCode"
                  type="password"
                  placeholder="Entrez le code secret manager"
                  required
                  value={managerCode}
                  onChange={(e) => setManagerCode(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Ce code est fourni uniquement aux managers autorisés.
                </p>
              </div>
            )}
            
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button 
              type="submit" 
              className="w-full bg-restaurant-primary hover:bg-restaurant-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Inscription en cours..." : "S'inscrire"}
            </Button>
            <div className="mt-4 text-center">
              <p className="text-sm">
                Déjà un compte?{" "}
                <a 
                  href="/login" 
                  className="text-restaurant-primary hover:underline"
                >
                  Se connecter
                </a>
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignUp;
