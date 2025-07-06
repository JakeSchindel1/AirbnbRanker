import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import statesData, { StayData } from '../data';

const PostView: React.FC = () => {
  const navigate = useNavigate();
  const [rankedItems, setRankedItems] = useState<StayData[]>([]);
  const [prevRankedItems, setPrevRankedItems] = useState<StayData[]>([]);

  useEffect(() => {
    // Load ranked items from localStorage
    const savedRankedItems = localStorage.getItem('rankedStates');
    const savedPrevRankedItems = localStorage.getItem('prevRankedStates');
    
    if (savedRankedItems) {
      try {
        const parsed = JSON.parse(savedRankedItems);
        setRankedItems(parsed || []);
      } catch (error) {
        console.error('Error loading rankings:', error);
      }
    }
    
    if (savedPrevRankedItems) {
      try {
        const parsedPrev = JSON.parse(savedPrevRankedItems);
        setPrevRankedItems(parsedPrev || []);
      } catch (error) {
        console.error('Error loading previous rankings:', error);
      }
    }
  }, []);

  // Function to get movement direction for an item
  const getMovementDirection = (itemId: string, currentIndex: number) => {
    const prevIndex = prevRankedItems.findIndex((item) => item.id === itemId);
    if (prevIndex === -1) return null; // Item wasn't ranked before
    if (currentIndex < prevIndex) return 'up';
    if (currentIndex > prevIndex) return 'down';
    return null; // No movement
  };

  const topItem = rankedItems[0];
  const restItems = rankedItems.slice(1);

  // Dynamic column calculation based on number of ranked items
  let numColumns = 2; // default
  if (rankedItems.length > 31) {
    numColumns = 4;
  } else if (rankedItems.length > 21) {
    numColumns = 3;
  }

  // Split items into columns
  const itemsPerColumn = Math.ceil(restItems.length / numColumns);
  const columns = [];
  for (let i = 0; i < numColumns; i++) {
    const startIndex = i * itemsPerColumn;
    const endIndex = startIndex + itemsPerColumn;
    columns.push(restItems.slice(startIndex, endIndex));
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Square container for Instagram */}
      <div className="w-full max-w-2xl mx-auto bg-white overflow-visible mb-4" style={{ aspectRatio: '4/3' }}>
        <div className="p-2 h-full flex flex-col overflow-visible">
          
          {/* Header */}
          <div className="text-center mb-1">
            <div className="bg-red-500 text-white px-6 py-2 rounded-full inline-block">
              <h1 className="text-lg font-bold">Top 50 Leaderboard</h1>
            </div>
          </div>

          {/* Top Ranked Item - Prominent */}
          {topItem && (
            <div className="bg-white rounded-xl px-6 py-3 mb-1 shadow-lg overflow-visible max-w-4xl mx-auto">
              <div className="flex items-center justify-between overflow-visible">
                <div className="flex items-center">
                  {/* Crown and image - Fixed positioning with more space */}
                  <div className="relative w-14 h-14 mr-4 mt-4">
                    <img
                      src="/crown.png"
                      alt="Crown"
                      className="absolute z-10 w-10 h-10 -top-6 left-2"
                    />
                    <img
                      src={topItem.imageUrl}
                      alt={topItem.propertyName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0 mr-4">
                    <h2 className="text-lg font-bold text-gray-900 truncate">{topItem.state}</h2>
                    <p className="text-sm text-gray-600 truncate">{topItem.propertyName}</p>
                  </div>
                </div>
                
                <div className="flex items-center overflow-visible">
                  <div className="w-12 h-12 mr-3 flex items-center justify-center overflow-visible">
                    <img 
                      src="/heart.png" 
                      alt="Heart" 
                      className="w-5 h-5 z-20" 
                    />
                  </div>
                  <span className="text-xl font-bold text-red-500 mr-2">1</span>
                  {(() => {
                    const movement = getMovementDirection(topItem.id, 0);
                    if (movement === 'up') return <span className="text-green-500 text-lg">▲</span>;
                    if (movement === 'down') return <span className="text-red-500 text-lg">▼</span>;
                    return null;
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Column Grid */}
          <div 
            className="flex-1 grid gap-0.5 overflow-visible"
            style={{ gridTemplateColumns: `repeat(${numColumns}, 1fr)` }}
          >
            {columns.map((column, columnIndex) => (
              <div key={columnIndex} className="space-y-0.5 px-0.5">
                {column.map((item, itemIndex) => {
                  const rank = columnIndex * itemsPerColumn + itemIndex + 2; // +2 because we start after #1
                  return (
                    <div key={item.id} className="flex items-center bg-gray-50 rounded-lg p-1">
                      <img
                        src={item.imageUrl}
                        alt={item.propertyName}
                        className="w-5 h-5 object-cover rounded-full mr-2 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{item.state}</p>
                        <p className="text-xs text-gray-500 truncate">{item.propertyName}</p>
                      </div>
                      <div className="flex items-center ml-1 flex-shrink-0">
                        <span className="text-xs font-bold text-gray-700">{rank}</span>
                        {(() => {
                          const movement = getMovementDirection(item.id, rank - 1);
                          if (movement === 'up') return <span className="text-green-500 ml-1 text-xs">▲</span>;
                          if (movement === 'down') return <span className="text-red-500 ml-1 text-xs">▼</span>;
                          return null;
                        })()}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation buttons outside the square */}
      <div className="max-w-lg mx-auto px-4 py-4 space-y-3 mt-8">
        <button
          onClick={() => navigate('/app')}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          ← Back to Rankings
        </button>
        
        <button
          onClick={() => window.print()}
          className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          📸 Save as Image
        </button>
        
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Screenshot this square area to share on Instagram! 📱
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostView; 