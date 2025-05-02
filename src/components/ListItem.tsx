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

  const movementIcon = movement === 'up'
    ? '▲'
    : movement === 'down'
    ? '▼'
    : '–';

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`flex items-center justify-between px-4 py-3 bg-white rounded-xl border-b border-gray-200 overflow-visible ${
            snapshot.isDragging ? 'bg-gray-100 shadow-xl z-10 transition-transform duration-200 ease-in-out' : ''
          } ${!isRanked ? 'opacity-90' : ''}`}
        >
          {/* Image with dark overlay when unranked */}
          <div className="relative w-16 h-16 mr-4 flex-shrink-0 rounded-full overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.propertyName}
              className="w-full h-full object-cover"
              style={{ filter: !isRanked ? 'brightness(0.1)' : 'none' }}
            />
          </div>

          {/* Text Info */}
          <div className="text-left flex-1 overflow-hidden">
            <h2 className="text-lg font-bold truncate">{item.state}</h2>
            {isRanked ? (
              <p className="text-sm text-gray-500 truncate">{item.propertyName}</p>
            ) : (
              <p className="text-sm text-transparent select-none">Hidden</p>
            )}
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
                {movementIcon}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default ListItem;
