
import { Badge } from "@/components/ui/badge";

type OrderStatus = "En attente" | "Lancée" | "Annulée";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  let color = "";
  switch (status) {
    case "En attente":
      color = "bg-yellow-500 hover:bg-yellow-600";
      break;
    case "Lancée":
      color = "bg-green-500 hover:bg-green-600";
      break;
    case "Annulée":
      color = "bg-red-500 hover:bg-red-600";
      break;
  }

  return (
    <Badge className={`${color} text-white`}>{status}</Badge>
  );
};

export default OrderStatusBadge;
