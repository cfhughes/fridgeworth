import { useState } from 'react';
import { Grocery } from '../App';
import { GroceryCard } from './GroceryCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ShoppingBasket } from 'lucide-react';

interface GroceryListProps {
  groceries: Grocery[];
  onToggleConsumed: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Grocery>) => void;
}

export function GroceryList({
  groceries,
  onToggleConsumed,
  onDelete,
  onEdit,
}: GroceryListProps) {
  const [activeTab, setActiveTab] = useState('active');

  const now = new Date();
  const activeGroceries = groceries.filter((g) => !g.isConsumed);
  const consumedGroceries = groceries.filter((g) => g.isConsumed);

  const categorizeGrocery = (grocery: Grocery) => {
    const daysUntilExpiry = Math.floor(
      (grocery.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 3) return 'expiring-soon';
    return 'fresh';
  };

  const sortedActiveGroceries = [...activeGroceries].sort((a, b) => {
    return a.expiryDate.getTime() - b.expiryDate.getTime();
  });

  const sortedConsumedGroceries = [...consumedGroceries].sort((a, b) => {
    return b.expiryDate.getTime() - a.expiryDate.getTime();
  });

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="active">
          Active ({activeGroceries.length})
        </TabsTrigger>
        <TabsTrigger value="consumed">
          Consumed ({consumedGroceries.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="active">
        {sortedActiveGroceries.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBasket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-500 mb-2">No groceries tracked yet</h3>
            <p className="text-gray-400">
              Add your first grocery item to get started
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedActiveGroceries.map((grocery) => (
              <GroceryCard
                key={grocery.id}
                grocery={grocery}
                status={categorizeGrocery(grocery)}
                onToggleConsumed={onToggleConsumed}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="consumed">
        {sortedConsumedGroceries.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBasket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-500 mb-2">No consumed items yet</h3>
            <p className="text-gray-400">
              Mark items as consumed to track your usage
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedConsumedGroceries.map((grocery) => (
              <GroceryCard
                key={grocery.id}
                grocery={grocery}
                status="consumed"
                onToggleConsumed={onToggleConsumed}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
