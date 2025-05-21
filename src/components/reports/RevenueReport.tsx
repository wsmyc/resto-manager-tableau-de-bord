
import { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign } from "lucide-react";

interface RevenueReportProps {
  reportType: string;
  data: Array<{ name: string; revenue: number }>;
}

export const RevenueReport = ({ reportType, data }: RevenueReportProps) => {
  const calculateTotalRevenue = (data: any[]) => {
    return data.reduce((sum, item) => sum + item.revenue, 0);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <CircleDollarSign className="h-5 w-5 text-restaurant-accent" />
          {reportType === "weekly" 
            ? "Revenus Hebdomadaires" 
            : reportType === "monthly" 
            ? "Revenus Mensuels" 
            : "Revenus Annuels"}
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Total: {calculateTotalRevenue(data).toLocaleString()} DZD
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
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
              <Bar dataKey="revenue" fill="#245536" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
