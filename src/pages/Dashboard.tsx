
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShoppingCart, Calendar, CircleDollarSign, UtensilsCrossed, TrendingUp, Users } from "lucide-react";

// Données révisées pour le tableau de bord
const weeklyRevenueData = [
  { name: 'Lun', revenue: 24000 },
  { name: 'Mar', revenue: 13980 },
  { name: 'Mer', revenue: 38000 },
  { name: 'Jeu', revenue: 39080 },
  { name: 'Ven', revenue: 48000 },
  { name: 'Sam', revenue: 58000 },
  { name: 'Dim', revenue: 43000 },
];

const ordersByCategory = [
  { name: 'Entrées', orders: 65 },
  { name: 'Plats', orders: 120 },
  { name: 'Desserts', orders: 85 },
  { name: 'Boissons', orders: 95 },
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeReservations: 0,
    weeklyRevenue: 0,
    popularItems: []
  });
  
  // In a real application, this would fetch data from Firebase
  useEffect(() => {
    // Simulate loading data from Firebase
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalOrders: 187,
        activeReservations: 24,
        weeklyRevenue: 125800,
        popularItems: [
          { name: "Chorba Frik", count: 32 },
          { name: "Couscous Agneau", count: 28 },
          { name: "Tagine Agneau Pruneaux", count: 23 },
          { name: "Tajine Kefta", count: 19 },
        ]
      });
    };
    
    fetchData();
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
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
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
            <div className="text-2xl font-bold">{stats.activeReservations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              12 pour aujourd'hui
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
            <div className="text-2xl font-bold">{stats.weeklyRevenue.toLocaleString()} DZD</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12.5% depuis la semaine dernière
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
                {stats.popularItems.map((item, index) => (
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
