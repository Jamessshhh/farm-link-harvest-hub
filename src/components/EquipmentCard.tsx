
import React from 'react';
import { MapPin, User, Tag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Equipment } from '@/types/equipment';

interface EquipmentCardProps {
  equipment: Equipment;
  onBorrow?: (equipment: Equipment) => void;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, onBorrow }) => {
  const { user } = useAuth();
  
  const isOwnEquipment = user && (equipment.owner_id === user.id || equipment.owner_name === (user.name ?? ''));
  
  const handleBorrowClick = () => {
    if (equipment.available && !isOwnEquipment && onBorrow) {
      onBorrow(equipment);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all">
      <div className="aspect-video mb-4 relative overflow-hidden rounded-lg bg-gray-100">
        {equipment.image_url ? (
          <img 
            src={equipment.image_url} 
            alt={equipment.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              console.error("Equipment image failed to load:", equipment.image_url);
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Tag size={48} className="text-gray-300" />
          </div>
        )}
      </div>

      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <Tag size={16} className="text-farmlink-accent mr-2" />
          <span className="text-sm text-farmlink-accent">{equipment.category}</span>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          equipment.available 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {equipment.available ? 'Available' : 'Borrowed'}
        </span>
      </div>
      
      <h3 className="font-semibold text-lg mb-2 text-farmlink-secondary">{equipment.name}</h3>
      <p className="text-sm text-gray-600 mb-4">{equipment.description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm">
          <User size={14} className="mr-2 text-gray-500" />
          <span className="text-gray-700">{equipment.owner_name}</span>
        </div>
        <div className="flex items-center text-sm">
          <MapPin size={14} className="mr-2 text-gray-500" />
          <span className="text-gray-700">{equipment.location}</span>
        </div>
      </div>
      
      <button 
        className={`w-full py-2 rounded-md text-center transition-colors ${
          equipment.available && !isOwnEquipment
            ? 'bg-farmlink-primary text-white hover:bg-farmlink-primary/90' 
            : isOwnEquipment
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
            : 'bg-gray-100 text-gray-500 cursor-not-allowed'
        }`}
        onClick={handleBorrowClick}
        disabled={!equipment.available || isOwnEquipment}
      >
        {equipment.available 
          ? isOwnEquipment 
            ? 'Your Own Equipment' 
            : 'Request to Borrow'
          : 'Currently Unavailable'
        }
      </button>
    </div>
  );
};

export default EquipmentCard;
