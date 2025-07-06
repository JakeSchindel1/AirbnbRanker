import React, { forwardRef, useEffect, useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { StayData } from '../data';

interface ListItemProps {
  item: StayData;
  index: number;
  isRanked: boolean;
  movement: 'up' | 'down' | null;
  rank?: number; // Optional rank for display (overrides index + 1)
  isRecentlyAdded?: boolean; // Whether this item was recently added to ranked
  glowColor?: string; // Custom glow color
  glowBlurRadius?: number; // Custom glow blur radius
}

const ListItem = forwardRef<HTMLDivElement, ListItemProps>(
  ({ item, index, isRanked, movement, rank, isRecentlyAdded, glowColor = 'green', glowBlurRadius = 5 }, ref) => {
    const displayRank = rank !== undefined ? rank : index + 1;
    const isTopRanked = isRanked && displayRank === 1;

    const [animateHeart, setAnimateHeart] = useState(false);
    const [animateCrown, setAnimateCrown] = useState(false);

    // Detect mobile device
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    // Get the appropriate CSS classes for the glow color and blur
    const getGlowClasses = (color: string, blurRadius: number) => {
      const colorMap: { [key: string]: string } = {
        green: 'ring-green-400 shadow-green-400',
        blue: 'ring-blue-400 shadow-blue-400',
        purple: 'ring-purple-400 shadow-purple-400',
        pink: 'ring-pink-400 shadow-pink-400',
        orange: 'ring-orange-400 shadow-orange-400',
        red: 'ring-red-400 shadow-red-400',
        yellow: 'ring-yellow-400 shadow-yellow-400',
        cyan: 'ring-cyan-400 shadow-cyan-400'
      };
      
      const blurMap: { [key: number]: string } = {
        1: '/10', 2: '/20', 3: '/25', 4: '/30', 5: '/35', 
        6: '/40', 7: '/45', 8: '/50', 9: '/60', 10: '/75'
      };
      
      const baseClass = colorMap[color] || colorMap.green;
      const blurClass = blurMap[blurRadius] || '/35';
      
      return `${baseClass}${blurClass}`;
    };

    useEffect(() => {
      if (isTopRanked) {
        setAnimateHeart(true);
        setAnimateCrown(true);
        const timeout = setTimeout(() => {
          setAnimateHeart(false);
          setAnimateCrown(false);
        }, 1200); // match glow duration
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
            className={`flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200 overflow-visible ${
              snapshot.isDragging 
                ? 'bg-gray-50 shadow-lg' 
                : 'hover:shadow-md'
            } ${isRecentlyAdded ? `ring-2 ring-opacity-50 shadow-lg ${getGlowClasses(glowColor, glowBlurRadius)}` : ''}`}
            style={{
              // Apply all provided styles to maintain proper positioning
              ...provided.draggableProps.style,
              ...(snapshot.isDragging && {
                zIndex: 9999,
                // On mobile, ensure full size and proper positioning
                ...(isMobile && {
                  width: 'calc(100vw - 2rem)', // Match mobile container width
                  maxWidth: '448px', // Match max-w-md
                  transform: provided.draggableProps.style?.transform || 'none',
                  pointerEvents: 'none',
                }),
              })
            }}
          >
            {/* Image wrapper with crown overlay */}
            <div className="relative w-16 h-16 mr-4 flex-shrink-0 rounded-full">
              {/* 👑 Crown overlay */}
              {isTopRanked && (
                <img
                  src="/crown.png"
                  alt="Crown"
                  className={`absolute z-[999] pointer-events-none ${
                    animateCrown ? 'animate-glow' : ''
                  }`}
                  style={{
                    width: '60%',
                    height: '60%',
                    top: -25,
                    left: 10,
                  }}
                />
              )}
              <img
                src={item.imageUrl}
                alt={item.propertyName}
                className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${
                  !isRanked ? 'brightness-[0.00001]' : 'brightness-100'
                }`}
              />
            </div>

            {/* Text Info */}
            <div className="text-left flex-1 overflow-hidden mr-2">
              <h2 className="text-lg font-bold leading-tight">{item.state}</h2>
              {isRanked ? (
                <p className="text-sm text-gray-500 font-normal leading-tight">
                  {item.propertyName}
                </p>
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

              <span className="mr-2">{isRanked ? displayRank : '?'}</span>

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
