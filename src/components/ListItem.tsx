import React, { forwardRef, useEffect, useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { StayData } from '../data';

interface ListItemProps {
  item: StayData;
  index: number;
  isRanked: boolean;
  movement: 'up' | 'down' | null;
}

const ListItem = forwardRef<HTMLDivElement, ListItemProps>(
  ({ item, index, isRanked, movement }, ref) => {
    const isTopRanked = isRanked && index === 0;

    const [animateHeart, setAnimateHeart] = useState(false);

    useEffect(() => {
      if (isTopRanked) {
        setAnimateHeart(true);
        const timeout = setTimeout(() => setAnimateHeart(false), 600); // match CSS duration
        return () => clearTimeout(timeout);
      }
    }, [isTopRanked]);

    return (
      <Draggable draggableId={item.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={(node) => {
              provided.innerRef(node);
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
              }
            }}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`flex items-center justify-between px-4 py-3 bg-white rounded-xl border-b border-gray-200 overflow-visible ${
              snapshot.isDragging ? 'bg-gray-100 shadow-xl z-10 transition-transform duration-200 ease-in-out' : ''
            }`}
          >
            {/* Image wrapper with fade + blacked-out unranked state */}
            <div className="relative w-16 h-16 mr-4 flex-shrink-0 rounded-full overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.propertyName}
                className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${
                  !isRanked ? 'brightness-[0.00001]' : 'brightness-100'
                }`}
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
                    className={`w-full h-full object-contain block ${animateHeart ? 'animate-pop' : ''}`}
                  />
                </div>
              )}

              <span className="mr-2">{isRanked ? index + 1 : '?'}</span>

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
                  {movement === 'up'
                    ? '▲'
                    : movement === 'down'
                    ? '▼'
                    : ''}
                </span>
              )}
            </div>
          </div>
        )}
      </Draggable>
    );
  }
);

export default ListItem;
