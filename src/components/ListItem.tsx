import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { StayData } from '../data';

interface ListItemProps {
  item: StayData;
  index: number;
  isRanked: boolean;
  movement: 'up' | 'down' | null;
}

const ListItem: React.FC<ListItemProps> = ({ item, index, isRanked, movement }) => {
  const isTopRanked = isRanked && index === 0;

  const visualEffect = !isRanked
    ? 'filter grayscale blur-sm opacity-60 transition duration-200'
    : '';

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`flex items-center justify-between px-4 py-3 bg-white rounded-xl border-b border-gray-200 overflow-visible ${
            snapshot.isDragging ? 'bg-gray-100 shadow-xl z-10 transition-transform duration-200 ease-in-out' : ''
          } ${visualEffect}`}
        >
          {/* Image */}
          <img
            src={item.imageUrl}
            alt={item.propertyName}
            className="w-16 h-16 rounded-full object-cover mr-4 flex-shrink-0"
          />

          {/* Text Info */}
          <div className="text-left flex-1 overflow-hidden">
            <h2 className="text-lg font-bold truncate">{item.state}</h2>
            <p className="text-sm text-gray-500 truncate">{item.propertyName}</p>
          </div>

          {/* Rank and Movement Indicator */}
          <div className="flex items-center text-xl font-bold overflow-visible">
            {isTopRanked && (
              <div className="w-5 h-5 mr-2 flex-shrink-0">
                <img
                  src="/heart.png"
                  alt="Heart"
                  className="w-full h-full object-contain block"
                />
              </div>
            )}

            <span className="mr-2">{isRanked ? index + 1 : '–'}</span>

            {isRanked && (
              <span
                className={`text-lg ${
                  movement === 'up'
                    ? 'text-green-500'
                    : movement === 'down'
                    ? 'text-red-500'
                    : 'text-gray-400'
                }`}
              >
                {movement === 'up' ? '▲' : movement === 'down' ? '▼' : '–'}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default ListItem;
