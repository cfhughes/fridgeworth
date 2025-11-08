import { Grocery } from '../App';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { MoreVertical, Check, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';
import { EditGroceryDialog } from './EditGroceryDialog';

interface GroceryCardProps {
  grocery: Grocery;
  status: 'expired' | 'expiring-soon' | 'fresh' | 'consumed';
  onToggleConsumed: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Grocery>) => void;
}

export function GroceryCard({
  grocery,
  status,
  onToggleConsumed,
  onDelete,
  onEdit,
}: GroceryCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const statusConfig = {
    expired: {
      label: 'Expired',
      variant: 'destructive' as const,
      borderColor: 'border-l-red-500',
    },
    'expiring-soon': {
      label: 'Expiring Soon',
      variant: 'default' as const,
      borderColor: 'border-l-yellow-500',
    },
    fresh: {
      label: 'Fresh',
      variant: 'secondary' as const,
      borderColor: 'border-l-green-500',
    },
    consumed: {
      label: 'Consumed',
      variant: 'outline' as const,
      borderColor: 'border-l-blue-500',
    },
  };

  const config = statusConfig[status];

  const getDaysRemaining = () => {
    const now = new Date();
    const days = Math.floor(
      (grocery.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (days < 0) return `Expired ${Math.abs(days)} days ago`;
    if (days === 0) return 'Expires today';
    if (days === 1) return 'Expires tomorrow';
    return `${days} days remaining`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <Card
        className={`p-4 border-l-4 ${config.borderColor} ${
          grocery.isConsumed ? 'opacity-60' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className={grocery.isConsumed ? 'line-through' : ''}>
              {grocery.name}
            </h3>
            <p className="text-gray-500 text-sm">{grocery.category}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onToggleConsumed(grocery.id)}>
                <Check className="mr-2 h-4 w-4" />
                {grocery.isConsumed ? 'Mark as Active' : 'Mark as Consumed'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(grocery.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          <Badge variant={config.variant}>{config.label}</Badge>

          <div className="text-sm space-y-1">
            <p className="text-gray-600">
              <span className="text-gray-500">Quantity:</span> {grocery.quantity}{' '}
              {grocery.unit}
            </p>
            <p className="text-gray-600">
              <span className="text-gray-500">Purchased:</span>{' '}
              {formatDate(grocery.purchaseDate)}
            </p>
            <p className="text-gray-600">
              <span className="text-gray-500">Expires:</span>{' '}
              {formatDate(grocery.expiryDate)}
            </p>
            {!grocery.isConsumed && (
              <p
                className={`${
                  status === 'expired'
                    ? 'text-red-600'
                    : status === 'expiring-soon'
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}
              >
                {getDaysRemaining()}
              </p>
            )}
          </div>
        </div>
      </Card>

      <EditGroceryDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        grocery={grocery}
        onEdit={onEdit}
      />
    </>
  );
}
