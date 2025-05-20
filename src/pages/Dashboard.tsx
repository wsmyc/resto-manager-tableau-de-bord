
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShoppingCart, Calendar, CircleDollarSign, UtensilsCrossed, TrendingUp, Users } from "lucide-react";
import { 
  listenToTotalOrders, 
  listenToActiveReservations, 
  listenToWeeklyRevenue,
  listenToDailyRevenue, 
  listenToPopularDishes,
  listenToOrdersByCategory
} from "@/services/dataServices";
import type { Plat } from "@/services/types";

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
  
  // Load all data from Firebase on component mount
  useEffect(() => {
    // Subscribe to real-time updates for total orders
    const unsubscribeOrders = listenToTotalOrders((count) => {
      setTotalOrders(count);
    });
    
    // Subscribe to real-time updates for active reservations
    const unsubscribeReservations = listenToActiveReservations((reservations) => {
      setActiveReservations(reservations.length);
      
      // Calculate today's reservations
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayCount = reservations.filter(res => {
        const resDate = res.date_time.toDate();
        resDate.setHours(0, 0, 0, 0);
        return resDate.getTime() === today.getTime();
      }).length;
      
      setTodayReservations(todayCount);
    });
    
    // Subscribe to real-time updates for weekly revenue
    const unsubscribeRevenue = listenToWeeklyRevenue((revenue) => {
      setWeeklyRevenue(revenue);
      
      // For demo purposes, let's set a random change percentage between 5 and 15%
      // In a real app, you would calculate this from historical data
      setWeeklyRevenueChange(Math.round((Math.random() * 10 + 5) * 10) / 10);
    });
    
    // Subscribe to real-time updates for daily revenue chart data
    const unsubscribeDailyRevenue = listenToDailyRevenue((dailyData) => {
      setWeeklyRevenueData(dailyData.map(item => ({
        name: item.name,
        revenue: item.revenue
      })));
    });
    
    // Subscribe to real-time updates for popular dishes
    const unsubscribePopularDishes = listenToPopularDishes(4, (dishes) => {
      setPopularItems(dishes.map(dish => ({
        name: dish.item.nom || 'Inconnu',
        count: dish.count
      })));
    });
    
    // Subscribe to real-time updates for orders by category
    const unsubscribeOrdersByCategory = listenToOrdersByCategory((categories) => {
      setOrdersByCategory(categories);
    });
    
    // Cleanup subscriptions on component unmount
    return () => {
      unsubscribeOrders();
      unsubscribeReservations();
      unsubscribeRevenue();
      unsubscribeDailyRevenue();
      unsubscribePopularDishes();
      unsubscribeOrdersByCategory();
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
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +8% depuis la semaine dernière
            </p>
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
            <div className="text-2xl font-bold">{activeReservations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {todayReservations} pour aujourd'hui
            </p>
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
            <div className="text-2xl font-bold">{weeklyRevenue.toLocaleString()} DZD</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{weeklyRevenueChange}% depuis la semaine dernière
            </p>
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
              <div className="space-y-4">
                {popularItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-restaurant-accent/10 w-8 h-8 rounded-full flex items-center justify-center">
                        <span className="text-restaurant-accent font-medium">{index + 1}</span>
                      </div>
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{item.count} commandes</span>
                  </div>
                ))}
              </div>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
