import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, X, Search, AlertCircle, PlusCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReservationForm from "@/components/reservations/ReservationForm";
import { db, logDebug } from "@/services/firebase";
import { collection, onSnapshot, query, orderBy, getDocs, setDoc, Timestamp, doc, getDoc } from "firebase/firestore";

interface Reservation {
  id: string;
  customerName: string;
  people: number;
  date: Date;
  time: string;
  status: "En attente" | "Confirmée" | "Annulée";
  phone: string;
  tableId: string;
}

const ReservationStatusBadge = ({ status }: { status: Reservation["status"] }) => {
  let badgeClass = "";
  
  switch (status) {
    case "En attente":
      badgeClass = "bg-yellow-500 hover:bg-yellow-600";
      break;
    case "Confirmée":
      badgeClass = "bg-green-500 hover:bg-green-600";
      break;
    case "Annulée":
      badgeClass = "bg-red-500 hover:bg-red-600";
      break;
  }
  
  return (
    <Badge className={`${badgeClass} text-white`}>{status}</Badge>
  );
};

const generateRandomPhoneNumber = (): string => {
  const prefixes = ["05", "06", "07"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Array(8)
    .fill(0)
    .map(() => Math.floor(Math.random() * 10))
    .join("");
  return `${prefix} ${number.slice(0, 2)} ${number.slice(2, 4)} ${number.slice(4, 6)} ${number.slice(6, 8)}`;
};

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all-statuses");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Reservation>>({
    customerName: "",
    phone: "",
    people: 2,
    date: new Date(),
    time: "19:30",
    status: "En attente",
    tableId: "table1",
  });

  const fetchClientDetails = async (clientId: string): Promise<string> => {
    try {
      const clientDocRef = doc(db, "clients", clientId);
      const clientDoc = await getDoc(clientDocRef);
      if (clientDoc.exists()) {
        const clientData = clientDoc.data();
        return clientData.username || "Client inconnu";
      }
      return "Client inconnu";
    } catch (error) {
      console.error("Error fetching client:", error);
      return "Client inconnu";
    }
  };

  useEffect(() => {
    if (!db) {
      console.error("Firestore db is not initialized!");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const q = query(collection(db, "reservations"), orderBy("date_time", "desc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      try {
        const reservationsData: Reservation[] = [];
        const clientPromises: Promise<void>[] = [];

        snapshot.docs.forEach(doc => {
          const data = doc.data();
          const reservationDate = parseISO(data.date_time);
          if (isNaN(reservationDate.getTime())) return;

          let status: Reservation["status"] = "En attente";
          switch (data.status?.toLowerCase()) {
            case "confirmed": status = "Confirmée"; break;
            case "cancelled": status = "Annulée"; break;
            case "pending": case "en attente": status = "En attente"; break;
          }

          const reservation: Reservation = {
            id: doc.id,
            customerName: "Client inconnu", // Placeholder until client data is fetched
            phone: generateRandomPhoneNumber(),
            people: data.party_size || 0,
            date: reservationDate,
            time: format(reservationDate, "HH:mm", { locale: fr }),
            status: status,
            tableId: data.table_id || "N/A",
          };

          const promise = fetchClientDetails(data.client_id).then(username => {
            reservation.customerName = username;
          });

          clientPromises.push(promise);
          reservationsData.push(reservation);
        });

        await Promise.all(clientPromises);
        setReservations([...reservationsData]); // Force re-render with updated data
        setIsLoading(false);
        logDebug("Reservations fetched successfully", reservationsData.length);
      } catch (error) {
        console.error("Error processing reservations:", error);
        toast.error("Erreur lors du chargement des réservations");
        setIsLoading(false);
      }
    }, (error) => {
      console.error("Error listening to reservations:", error);
      toast.error("Erreur de connexion à la base de données");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const cancelReservation = async (reservationId: string) => {
    try {
      if (!db) throw new Error("Firestore db is not initialized!");
      const reservationDocRef = doc(db, "reservations", reservationId);
      await setDoc(reservationDocRef, { status: "cancelled" }, { merge: true });
      toast.success(`Réservation ${reservationId} annulée`);
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      toast.error("Erreur lors de l'annulation de la réservation");
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.phone.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all-statuses" || reservation.status === statusFilter;
    
    const matchesDate = !dateFilter || 
      (reservation.date.getDate() === dateFilter.getDate() &&
       reservation.date.getMonth() === dateFilter.getMonth() &&
       reservation.date.getFullYear() === dateFilter.getFullYear());
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const sortedReservations = [...filteredReservations].sort((a, b) => {
    const dateComparison = a.date.getTime() - b.date.getTime();
    if (dateComparison !== 0) return dateComparison;
    return a.time.localeCompare(b.time);
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData({ ...formData, date });
  };

  const handleTimeChange = (value: string) => {
    if (value === "default") return;
    setFormData({ ...formData, time: value });
  };

  const handlePeopleChange = (value: string) => {
    if (value === "default") return;
    setFormData({ ...formData, people: parseInt(value) });
  };

  const resetForm = () => {
    setFormData({
      customerName: "",
      phone: "",
      people: 2,
      date: new Date(),
      time: "19:30",
      status: "En attente",
      tableId: "table1",
    });
  };

  const handleAddReservation = async () => {
    if (!db) {
      console.error("Firestore db is not initialized!");
      toast.error("Erreur de connexion à la base de données");
      return;
    }

    if (!formData.customerName || !formData.phone || !formData.date || !formData.time || !formData.people || !formData.tableId) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const randomPhone = generateRandomPhoneNumber();
      const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await setDoc(doc(db, "clients", clientId), {
        username: formData.customerName,
        phone_number: randomPhone,
      });

      const [hours, minutes] = formData.time.split(":");
      const reservationDate = new Date(formData.date);
      reservationDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const reservationId = `res_${format(reservationDate, "yyyyMMddHHmmss")}`;
      await setDoc(doc(db, "reservations", reservationId), {
        client_id: clientId,
        date_time: reservationDate.toISOString(),
        party_size: formData.people,
        status: "pending",
        table_id: formData.tableId,
        created_at: Timestamp.fromDate(new Date()),
      });

      toast.success("Réservation ajoutée");
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error adding reservation:", error);
      toast.error("Erreur lors de l'ajout de la réservation");
    }
  };

  const formatDateLabel = (date: Date) => {
    if (isToday(date)) return "Aujourd'hui";
    if (isTomorrow(date)) return "Demain";
    return format(date, "P", { locale: fr });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="card-dashboard">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold text-restaurant-primary">Réservations</CardTitle>
          <Button 
            className="bg-restaurant-primary hover:bg-restaurant-primary/90"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle Réservation
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Rechercher une réservation..."
                className="pl-10 input-field"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 input-field">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-statuses">Tous les statuts</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Confirmée">Confirmée</SelectItem>
                  <SelectItem value="Annulée">Annulée</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full sm:w-52 justify-start text-left font-normal input-field",
                      !dateFilter && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFilter ? format(dateFilter, "P", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateFilter}
                    onSelect={setDateFilter}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>

              {dateFilter && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setDateFilter(undefined)}
                  className="h-10 w-10"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-restaurant-accent"></div>
              <p className="mt-2 text-restaurant-primary">Chargement des réservations...</p>
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-8 flex flex-col items-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-2" />
              <h3 className="font-medium text-lg text-restaurant-primary">Aucune réservation trouvée</h3>
              <p className="text-gray-500 mt-1">Essayez de modifier vos filtres ou votre recherche</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nom du Client</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Personnes</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">{reservation.id}</TableCell>
                      <TableCell>{reservation.customerName}</TableCell>
                      <TableCell>{reservation.phone}</TableCell>
                      <TableCell>{reservation.people}</TableCell>
                      <TableCell>{formatDateLabel(reservation.date)}</TableCell>
                      <TableCell>{reservation.time}</TableCell>
                      <TableCell>
                        <ReservationStatusBadge status={reservation.status} />
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => cancelReservation(reservation.id)}
                          disabled={reservation.status === "Annulée"}
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nouvelle Réservation</DialogTitle>
          </DialogHeader>
          <ReservationForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleDateChange={handleDateChange}
            handleTimeChange={handleTimeChange}
            handlePeopleChange={handlePeopleChange}
            onSubmit={handleAddReservation}
            onCancel={() => { setIsAddDialogOpen(false); resetForm(); }}
            submitLabel="Ajouter"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reservations;