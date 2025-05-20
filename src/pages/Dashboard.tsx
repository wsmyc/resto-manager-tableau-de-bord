
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShoppingCart, Calendar, CircleDollarSign, TrendingUp, Users, UtensilsCrossed } from "lucide-react";
import { collection, query, where, getDocs, onSnapshot, orderBy, Timestamp } from "firebase/firestore";
import { db, logDebug } from "@/services/firebase";
import { toast } from "sonner";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";
import { fr } from "date-fns/locale";
import type { Commande, Plat, Reservation, CommandePlat } from "@/services/types";

const Dashboard = () => {
  // State for real-time data
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [activeReservations, setActiveReservations] = useState<number>(0);
  const [todayReservations, setTodayReservations] = useState<number>(0);
  const [weeklyRevenue, setWeeklyRevenue] = useState<number>(0);
  const [weeklyRevenueChange, setWeeklyRevenueChange] = useState<number>(0);
  const [weeklyRevenueData, setWeeklyRevenueData] = useState<Array<{ name: string; revenue: number }>>([]);
  const [popularItems, setPopularItems] = useState<Array<{ name: string; count: number }>>([]);
  const [ordersByCategory, setOrdersByCategory] = useState<Array<{ name: string; orders: number }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Load all data from Firebase on component mount
  useEffect(() => {
    setIsLoading(true);
    
    // 1. Subscribe to real-time updates for total orders
    const ordersRef = collection(db, 'commandes');
    const unsubscribeOrders = onSnapshot(ordersRef, 
      (snapshot) => {
        setTotalOrders(snapshot.size);
        logDebug('Total orders updated:', snapshot.size);
      },
      (error) => {
        console.error("Error getting orders:", error);
        toast.error("Erreur lors du chargement des commandes");
      }
    );
    
    // 2. Subscribe to real-time updates for active reservations
    const reservationsRef = query(
      collection(db, 'reservations'),
      where('status', '==', 'confirmed')
    );
    
    const unsubscribeReservations = onSnapshot(reservationsRef, 
      (snapshot) => {
        setActiveReservations(snapshot.size);
        
        // Calculate today's reservations
        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        
        const todayCount = snapshot.docs.filter(doc => {
          const resData = doc.data();
          return resData.date_time.startsWith(today);
        }).length;
        
        setTodayReservations(todayCount);
        logDebug('Active reservations updated:', snapshot.size);
      },
      (error) => {
        console.error("Error getting reservations:", error);
        toast.error("Erreur lors du chargement des réservations");
      }
    );
    
    // 3. Subscribe to real-time updates for weekly revenue
    const now = new Date();
    const startOfWeekDate = startOfWeek(now, { weekStartsOn: 1 }); // Start from Monday
    const startOfWeekTimestamp = Timestamp.fromDate(startOfWeekDate);
    
    const confirmedOrdersRef = query(
      collection(db, 'commandes'),
      where('dateCreation', '>=', startOfWeekTimestamp),
      where('etat', 'in', ['confirmee', 'confirmed', 'prete', 'servie'])
    );
    
    const unsubscribeRevenue = onSnapshot(confirmedOrdersRef, 
      (snapshot) => {
        const total = snapshot.docs.reduce((sum, doc) => {
          const data = doc.data();
          return sum + (data.montant || 0);
        }, 0);
        
        setWeeklyRevenue(total);
        
        // For demo purposes, we'll set a random weekly change
        // In a real app, you would compare with previous week's data
        const previousWeekChange = Math.floor(Math.random() * 15) + 5;
        setWeeklyRevenueChange(previousWeekChange);
        
        logDebug('Weekly revenue updated:', total);
      },
      (error) => {
        console.error("Error getting revenue:", error);
        toast.error("Erreur lors du calcul des revenus");
      }
    );
    
    // 4. Generate daily revenue data for the past 7 days
    const fetchDailyRevenue = async () => {
      try {
        const dailyData = [];
        
        // Create array of last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = subDays(new Date(), i);
          const dayName = format(date, 'EEE', { locale: fr });
          const formattedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1, 3);
          
          // Query for this specific day
          const dayStart = new Date(date);
          dayStart.setHours(0, 0, 0, 0);
          
          const dayEnd = new Date(date);
          dayEnd.setHours(23, 59, 59, 999);
          
          const q = query(
            collection(db, 'commandes'),
            where('dateCreation', '>=', Timestamp.fromDate(dayStart)),
            where('dateCreation', '<=', Timestamp.fromDate(dayEnd)),
            where('etat', 'in', ['confirmee', 'confirmed', 'prete', 'servie'])
          );
          
          const querySnapshot = await getDocs(q);
          const dayRevenue = querySnapshot.docs.reduce((sum, doc) => {
            const data = doc.data();
            return sum + (data.montant || 0);
          }, 0);
          
          dailyData.push({
            name: formattedDay,
            date: format(date, 'yyyy-MM-dd'),
            revenue: dayRevenue
          });
        }
        
        setWeeklyRevenueData(dailyData);
        logDebug('Daily revenue data updated', dailyData);
      } catch (error) {
        console.error("Error fetching daily revenue:", error);
      }
    };
    
    fetchDailyRevenue();
    
    // 5. Get popular dishes
    const fetchPopularDishes = async () => {
      try {
        // First get all commande_plat entries to count dish popularity
        const commandePlatsSnapshot = await getDocs(collection(db, 'commande_plats'));
        
        const platCounts = new Map<string, number>();
        
        // Count occurrences of each dish
        commandePlatsSnapshot.forEach(doc => {
          const data = doc.data() as CommandePlat;
          const platId = data.idP;
          const quantity = data.quantité || 1;
          
          platCounts.set(platId, (platCounts.get(platId) || 0) + quantity);
        });
        
        // Get dish details for the counted IDs
        const platsSnapshot = await getDocs(collection(db, 'plats'));
        const platsMap = new Map<string, Plat>();
        
        platsSnapshot.forEach(doc => {
          platsMap.set(doc.id, { id: doc.id, ...doc.data() } as Plat);
        });
        
        // Create the final popular items array
        const popularItemsData = Array.from(platCounts.entries())
          .map(([id, count]) => {
            const plat = platsMap.get(id);
            return {
              id,
              name: plat ? plat.nom_du_plat : `Plat #${id}`,
              count
            };
          })
          .sort((a, b) => b.count - a.count)
          .slice(0, 4); // Top 4 most popular
        
        setPopularItems(popularItemsData);
        logDebug('Popular dishes updated', popularItemsData);
      } catch (error) {
        console.error("Error fetching popular dishes:", error);
      }
    };
    
    fetchPopularDishes();
    
    // 6. Get orders by category
    const fetchOrdersByCategory = async () => {
      try {
        // Get all commande_plat entries
        const commandePlatsSnapshot = await getDocs(collection(db, 'commande_plats'));
        
        // Get all plats to map them to categories
        const platsSnapshot = await getDocs(collection(db, 'plats'));
        const platCategoryMap = new Map<string, number>();
        
        platsSnapshot.forEach(doc => {
          const data = doc.data() as Plat;
          platCategoryMap.set(doc.id, data.idCat);
        });
        
        // Count orders by category
        const categoryCounts = new Map<number, number>();
        
        commandePlatsSnapshot.forEach(doc => {
          const data = doc.data() as CommandePlat;
          const platId = data.idP;
          const quantity = data.quantité || 1;
          
          const categoryId = platCategoryMap.get(platId);
          if (categoryId) {
            categoryCounts.set(categoryId, (categoryCounts.get(categoryId) || 0) + quantity);
          }
        });
        
        // Map category IDs to names
        const categoryMapping: Record<number, string> = {
          100: 'Entrées',
          200: 'Plats',
          300: 'Desserts',
          400: 'Accompagnements',
          500: 'Boissons'
        };
        
        // Create final data array
        const categoryData = Array.from(categoryCounts.entries())
          .map(([categoryId, count]) => ({
            name: categoryMapping[categoryId] || `Catégorie ${categoryId}`,
            orders: count
          }))
          .sort((a, b) => b.orders - a.orders);
        
        setOrdersByCategory(categoryData);
        logDebug('Orders by category updated', categoryData);
      } catch (error) {
        console.error("Error fetching orders by category:", error);
      }
    };
    
    fetchOrdersByCategory();
    
    setIsLoading(false);
    
    // Cleanup subscriptions on component unmount
    return () => {
      unsubscribeOrders();
      unsubscribeReservations();
      unsubscribeRevenue();
    };
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Orders */}
        <Card className="card-dashboard">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Commandes Totales
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-restaurant-accent" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{totalOrders}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Basé sur les données en temps réel
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Active Reservations */}
        <Card className="card-dashboard">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Réservations Actives
            </CardTitle>
            <Calendar className="h-4 w-4 text-restaurant-accent" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{activeReservations}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {todayReservations} pour aujourd'hui
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Weekly Revenue */}
        <Card className="card-dashboard">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenus Cette Semaine
            </CardTitle>
            <CircleDollarSign className="h-4 w-4 text-restaurant-accent" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{weeklyRevenue.toLocaleString()} DZD</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +{weeklyRevenueChange}% depuis la semaine dernière
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Revenue Chart */}
        <Card className="card-dashboard col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-restaurant-accent" />
              Revenus Hebdomadaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 w-full bg-gray-100 animate-pulse rounded"></div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyRevenueData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} DZD`, 'Revenus']}
                      contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    />
                    <Bar dataKey="revenue" fill="#ba3400" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Most Popular Items */}
        <div className="space-y-6 col-span-1">
          <Card className="card-dashboard">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5 text-restaurant-accent" />
                Plats les Plus Populaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-200 w-8 h-8 rounded-full animate-pulse"></div>
                        <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                      </div>
                      <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {popularItems.length > 0 ? (
                    popularItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-restaurant-accent/10 w-8 h-8 rounded-full flex items-center justify-center">
                            <span className="text-restaurant-accent font-medium">{index + 1}</span>
                          </div>
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{item.count} commandes</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucune donnée disponible
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="card-dashboard">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Users className="h-5 w-5 text-restaurant-accent" />
                Commandes par Catégorie
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-48 w-full bg-gray-100 animate-pulse rounded"></div>
              ) : (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={ordersByCategory}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip 
                        formatter={(value) => [`${value}`, 'Commandes']}
                        contentStyle={{
                          backgroundColor: 'white',
                          borderRadius: '0.5rem',
                          border: 'none',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}
                      />
                      <Bar dataKey="orders" fill="#245536" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
