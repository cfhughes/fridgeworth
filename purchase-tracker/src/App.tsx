import { useState, useEffect } from 'react';
import { GroceryList } from './components/GroceryList';
import { AddGroceryDialog } from './components/AddGroceryDialog';
import { GroceryStats } from './components/GroceryStats';
import { Button } from './components/ui/button';
import { Plus } from 'lucide-react';

export interface Grocery {
  id: string;
  name: string;
  category: string;
  purchaseDate: Date;
  expiryDate: Date;
  quantity: number;
  unit: string;
  isConsumed: boolean;
}

export default function App() {
  const [groceries, setGroceries] = useState<Grocery[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load groceries from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('groceries');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      const groceriesWithDates = parsed.map((g: any) => ({
        ...g,
        purchaseDate: new Date(g.purchaseDate),
        expiryDate: new Date(g.expiryDate),
      }));
      setGroceries(groceriesWithDates);
    }
  }, []);

  // Save groceries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('groceries', JSON.stringify(groceries));
  }, [groceries]);

  const addGrocery = (grocery: Omit<Grocery, 'id' | 'isConsumed'>) => {
    const newGrocery: Grocery = {
      ...grocery,
      id: crypto.randomUUID(),
      isConsumed: false,
    };
    setGroceries([...groceries, newGrocery]);
  };

  const toggleConsumed = (id: string) => {
    setGroceries(
      groceries.map((g) =>
        g.id === id ? { ...g, isConsumed: !g.isConsumed } : g
      )
    );
  };

  const deleteGrocery = (id: string) => {
    setGroceries(groceries.filter((g) => g.id !== id));
  };

  const editGrocery = (id: string, updates: Partial<Grocery>) => {
    setGroceries(
      groceries.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-green-700 mb-2">Grocery Expiry Tracker</h1>
              <p className="text-gray-600">
                Keep track of your groceries and never let food go to waste
              </p>
            </div>
            <Button onClick={() => setIsDialogOpen(true)} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Add Grocery
            </Button>
          </div>
          <GroceryStats groceries={groceries} />
        </header>

        <GroceryList
          groceries={groceries}
          onToggleConsumed={toggleConsumed}
          onDelete={deleteGrocery}
          onEdit={editGrocery}
        />

        <AddGroceryDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onAdd={addGrocery}
        />
      </div>
    </div>
  );
}
