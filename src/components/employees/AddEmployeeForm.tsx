import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Employee } from "./EmployeeList"

const formSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string()
    .min(10, "Numéro de téléphone invalide")
    .max(14, "Numéro de téléphone trop long")
    .transform(value => {
      // Supprimer tous les caractères non numériques
      const cleaned = value.replace(/\D/g, '');
      // Vérifier si le numéro a plus de 12 chiffres
      if (cleaned.length > 12) {
        return cleaned.slice(0, 12);
      }
      // Reformater avec des espaces tous les 2 chiffres
      return cleaned.replace(/(\d{2})(?=\d)/g, "$1 ");
    }),
  role: z.enum(["Chef", "Serveur"]),
  salary: z.coerce.number().min(0, "Le salaire doit être un nombre positif"),
})

interface AddEmployeeFormProps {
  onSuccess: (employee: Employee) => void;
}

export const AddEmployeeForm = ({ onSuccess }: AddEmployeeFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "Serveur",
      salary: 1800,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Vérifier l'email avec l'API Abstract
      const response = await fetch(`https://emailverification.whoisxmlapi.com/api/v2?apiKey=at_2rB2RVVFv1WQkWcpqQF0x6NSC4LOi&emailAddress=${values.email}`);
      const data = await response.json();
      
      if (!response.ok || data.formatCheck !== 'true' || data.smtpCheck !== 'true') {
        toast.error("L'adresse email n'est pas valide ou n'existe pas");
        return;
      }

      // Créer un nouvel employé avec un ID généré
      const newEmployee: Employee = {
        id: Date.now(),
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        role: values.role,
        salary: values.salary,
      };
      
      console.log("Nouvel employé ajouté:", newEmployee);
      toast.success("Employé ajouté avec succès");
      onSuccess(newEmployee);
      form.reset();
    } catch (error) {
      console.error("Erreur lors de la vérification de l'email:", error);
      toast.error("Erreur lors de la vérification de l'email");
    }
  }

  // Fonction pour formater le numéro de téléphone pendant la saisie
  const formatPhoneNumber = (value: string) => {
    // Supprimer tous les caractères non numériques
    const cleaned = value.replace(/\D/g, '');
    // Ajouter des espaces tous les 2 chiffres
    const formatted = cleaned.replace(/(\d{2})(?=\d)/g, "$1 ");
    return formatted;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Jean" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Dupont" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="jean.dupont@restaurant.fr" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input 
                  placeholder="06 12 34 56 78" 
                  {...field} 
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    field.onChange(formatted);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rôle</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Chef">Chef</SelectItem>
                    <SelectItem value="Serveur">Serveur</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salaire (€/mois)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step={100} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Ajouter l'employé</Button>
        </div>
      </form>
    </Form>
  )
}
