import { Grocery } from '../App';
import { Card } from './ui/card';
import { AlertCircle, CheckCircle, Clock, Package } from 'lucide-react';

interface GroceryStatsProps {
  groceries: Grocery[];
}

export function GroceryStats({ groceries }: GroceryStatsProps) {
  const now = new Date();
  const activeGroceries = groceries.filter((g) => !g.isConsumed);

  const expired = activeGroceries.filter(
    (g) => g.expiryDate < now
  ).length;

  const expiringSoon = activeGroceries.filter((g) => {
    const daysUntilExpiry = Math.floor(
      (g.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry >= 0 && daysUntilExpiry <= 3;
  }).length;

  const fresh = activeGroceries.filter((g) => {
    const daysUntilExpiry = Math.floor(
      (g.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry > 3;
  }).length;

  const consumed = groceries.filter((g) => g.isConsumed).length;

  const stats = [
    {
      label: 'Expired',
      value: expired,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Expiring Soon',
      value: expiringSoon,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Fresh',
      value: fresh,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Consumed',
      value: consumed,
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className={`p-4 ${stat.bgColor}`}>
          <div className="flex items-center gap-3">
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
            <div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className={`text-2xl ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
