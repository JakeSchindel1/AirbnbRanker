import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import ListItem from './components/ListItem';
import statesData, { StayData } from './data';
import { useNavigate } from 'react-router-dom';
import { GlowSettings } from './components/Settings';

const STORAGE_KEY = 'rankedStates';

const DEFAULT_GLOW_SETTINGS: GlowSettings = {
  enabled: true,
  color: 'green',
  duration: 3,
  blurRadius: 5
};

const App: React.FC = () => {
  const [rankedItems, setRankedItems] = useState<StayData[]>([]);
  const [unrankedItems, setUnrankedItems] = useState<StayData[]>([]);
  const [recentlyAddedItemId, setRecentlyAddedItemId] = useState<string | null>(null);
  const [glowSettings, setGlowSettings] = useState<GlowSettings>(DEFAULT_GLOW_SETTINGS);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const prevRankedRef = useRef<StayData[]>([]);
  const topRankedRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have saved rankings
    const savedRankedItems = localStorage.getItem(STORAGE_KEY);
    
    if (savedRankedItems) {
      try {
        const parsedRanked = JSON.parse(savedRankedItems);
        // If we have valid ranked items, use them
        if (parsedRanked && Array.isArray(parsedRanked) && parsedRanked.length > 0) {
          const rankedIds = new Set(parsedRanked.map((item: StayData) => item.id));
          const remainingUnranked = statesData.filter((item) => !rankedIds.has(item.id));

          setRankedItems(parsedRanked);
          setUnrankedItems(remainingUnranked);
          prevRankedRef.current = parsedRanked;
        } else {
          // Empty or invalid data - load presets
          loadPresetRankings();
        }
      } catch (error) {
        console.error('Error parsing saved data:', error);
        loadPresetRankings();
      }
    } else {
      // No saved data at all - load presets
      loadPresetRankings();
    }
  }, []);

  const loadPresetRankings = () => {
    // Set up preset rankings - your top 25 states
    const initialRankedIds = [
      "10", // 1) Oklahoma
      "2",  // 2) New Mexico
      "5",  // 3) Utah
      "18", // 4) Georgia
      "25", // 5) New Jersey
      "15", // 6) Florida
      "11", // 7) Arkansas
      "6",  // 8) Colorado
      "19", // 9) Tennessee
      "3",  // 10) Arizona
      "20", // 11) Kentucky
      "22", // 12) Virginia
      "12", // 13) Louisiana
      "8",  // 14) Kansas
      "1",  // 15) Texas
      "9",  // 16) Missouri
      "14", // 17) Alabama
      "24", // 18) Delaware
      "23", // 19) Maryland
      "17", // 20) North Carolina
      "16", // 21) South Carolina
      "21", // 22) West Virginia
      "13", // 23) Mississippi
      "4",  // 24) Nevada
      "7"   // 25) Nebraska
    ];
    
    const initialRanked = initialRankedIds.map(id => 
      statesData.find(item => item.id === id)!
    );
    
    const rankedIds = new Set(initialRankedIds);
    const remainingUnranked = statesData.filter((item) => !rankedIds.has(item.id));

    setRankedItems(initialRanked);
    setUnrankedItems(remainingUnranked);
    prevRankedRef.current = initialRanked;
    
    // Save the preset rankings
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialRanked));
  };

  // Auto-save rankings to browser cache
  useEffect(() => {
    if (rankedItems.length > 0) { // Only save if we have data
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rankedItems));
        
        // Show save indicator briefly
        setShowSaveIndicator(true);
        const timer = setTimeout(() => setShowSaveIndicator(false), 1500);
        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Failed to save rankings:', error);
      }
    }
  }, [rankedItems]);

  // Load glow settings from localStorage
  useEffect(() => {
    const savedGlowSettings = localStorage.getItem('glowSettings');
    if (savedGlowSettings) {
      try {
        const parsed = JSON.parse(savedGlowSettings);
        setGlowSettings({ ...DEFAULT_GLOW_SETTINGS, ...parsed });
      } catch (error) {
        console.error('Error parsing glow settings:', error);
      }
    }
  }, []);

  // Clear the recently added highlight after custom duration
  useEffect(() => {
    if (recentlyAddedItemId && glowSettings.enabled) {
      const timeout = setTimeout(() => {
        setRecentlyAddedItemId(null);
      }, glowSettings.duration * 1000);
      return () => clearTimeout(timeout);
    }
  }, [recentlyAddedItemId, glowSettings.duration, glowSettings.enabled]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const prevTopId = rankedItems[0]?.id;

    let updatedRanked = [...rankedItems];
    let updatedUnranked = [...unrankedItems];

    // Check if source/destination are ranked (includes column-based droppables)
    const isSourceRanked = source.droppableId === 'ranked' || source.droppableId.startsWith('ranked-');
    const isDestRanked = destination.droppableId === 'ranked' || destination.droppableId.startsWith('ranked-');

    if (isSourceRanked && isDestRanked) {
      // Within ranked list
      let sourceIndex = source.index;
      let destIndex = destination.index;
      
      // Handle column-based droppables (desktop)
      if (source.droppableId.startsWith('ranked-')) {
        const sourceColumn = parseInt(source.droppableId.split('-')[1]);
        sourceIndex = sourceColumn * 10 + source.index;
      }
      
      if (destination.droppableId.startsWith('ranked-')) {
        const destColumn = parseInt(destination.droppableId.split('-')[1]);
        destIndex = destColumn * 10 + destination.index;
      }
      
      const [movedItem] = updatedRanked.splice(sourceIndex, 1);
      updatedRanked.splice(destIndex, 0, movedItem);
      
    } else if (isSourceRanked && !isDestRanked) {
      // From ranked to unranked
      let sourceIndex = source.index;
      
      // Handle column-based droppables (desktop)
      if (source.droppableId.startsWith('ranked-')) {
        const sourceColumn = parseInt(source.droppableId.split('-')[1]);
        sourceIndex = sourceColumn * 10 + source.index;
      }
      
      const [movedItem] = updatedRanked.splice(sourceIndex, 1);
      updatedUnranked.splice(destination.index, 0, movedItem);
      
    } else if (!isSourceRanked && isDestRanked) {
      // From unranked to ranked
      let destIndex = destination.index;
      
      // Handle column-based droppables (desktop)
      if (destination.droppableId.startsWith('ranked-')) {
        const destColumn = parseInt(destination.droppableId.split('-')[1]);
        destIndex = destColumn * 10 + destination.index;
      }
      
      const [movedItem] = updatedUnranked.splice(source.index, 1);
      updatedRanked.splice(destIndex, 0, movedItem);
      
      // Set the recently added item for glow effect (if enabled)
      if (glowSettings.enabled) {
        setRecentlyAddedItemId(movedItem.id);
      }
      
    } else {
      // Within unranked list
      const [movedItem] = updatedUnranked.splice(source.index, 1);
      updatedUnranked.splice(destination.index, 0, movedItem);
    }

    // Save previous rankings to localStorage for PostView
    localStorage.setItem('prevRankedStates', JSON.stringify(rankedItems));
    
    prevRankedRef.current = rankedItems;
    setRankedItems(updatedRanked);
    setUnrankedItems(updatedUnranked);

    const newTopId = updatedRanked[0]?.id;
    if (newTopId && newTopId !== prevTopId && topRankedRef.current) {
      const { fireConfettiAtElement } = await import('./utils/confetti');
      fireConfettiAtElement(topRankedRef.current);
    }
  };



  const getMovementDirection = (itemId: string, currentIndex: number) => {
    const prevIndex = prevRankedRef.current.findIndex((item) => item.id === itemId);
    if (prevIndex === -1) return null;
    if (currentIndex < prevIndex) return 'up';
    if (currentIndex > prevIndex) return 'down';
    return null;
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };



  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="max-w-md md:max-w-4xl lg:max-w-6xl xl:max-w-7xl w-full pt-8 pb-20 px-4 text-center">
          <div className="flex justify-between items-center mb-8">
            <img 
              src="/airbnb.png" 
              alt="Airbnb Logo" 
              className="w-12 h-12 cursor-pointer hover:opacity-90 transition-opacity" 
              onClick={handleLogout}
              title="Secret logout button"
            />
            <div className="relative">
              <span className="text-sm block font-normal text-gray-600">
                50 States • Auto-saves to browser
              </span>
              <h1 className="text-4xl font-bold">Top Stays</h1>
              
              {/* Auto-save indicator */}
              {showSaveIndicator && (
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                  ✓ Saved to Browser
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span
                className="text-3xl cursor-pointer hover:opacity-80 transition-opacity"
                title="Post View for Instagram"
                onClick={() => navigate('/post-view')}
              >
                📸
              </span>
              <span
                className="text-3xl cursor-pointer hover:opacity-80 transition-opacity"
                title="Settings"
                onClick={() => navigate('/settings')}
              >
                ⚙️
              </span>
              <span
                className="text-4xl cursor-pointer hover:opacity-80 transition-opacity"
                title="Click to reset rankings"
                onClick={() => {
                  const confirmed = window.confirm(
                    "Are you sure you want to reset to the preset rankings? This can't be undone."
                  );
                  if (confirmed) {
                    localStorage.removeItem(STORAGE_KEY);
                    loadPresetRankings();
                  }
                }}
              >
                🏆
              </span>
            </div>
          </div>

          <div className="mb-8 p-4">
            <h2 className="text-2xl font-bold mb-6">Ranked</h2>
            
            {/* Mobile: Single column layout */}
            <div className="block md:hidden">
              <Droppable droppableId="ranked" direction="vertical">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="px-2 min-h-[100px] space-y-2"
                    style={{
                      paddingTop: '8px',
                      paddingBottom: '8px',
                    }}
                  >
                    {rankedItems.map((item, index) => (
                      <ListItem
                        key={item.id}
                        item={item}
                        index={index}
                        isRanked={true}
                        movement={getMovementDirection(item.id, index)}
                        rank={index + 1}
                        isRecentlyAdded={recentlyAddedItemId === item.id}
                        glowColor={glowSettings.color}
                        glowBlurRadius={glowSettings.blurRadius}
                        ref={index === 0 ? topRankedRef : undefined}
                      />
                    ))}
                    {provided.placeholder}
                    
                    {/* Empty state with drop indicators */}
                    {rankedItems.length === 0 && (
                      <div className="h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 mx-2">
                        Drop states here to rank them
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
            
            {/* Desktop: Multi-column grid layout */}
            <div className="hidden md:block">
              <div className="overflow-x-auto pb-4 px-4">
                <div className="flex space-x-6 min-w-max">
                  {[0, 1, 2, 3, 4].map((columnIndex) => (
                    <div key={columnIndex} className="flex-shrink-0 w-[450px]">
                      {/* Column header */}
                      <div className="text-sm font-semibold text-gray-600 mb-6 text-center">
                        Ranks {columnIndex * 10 + 1}-{Math.min((columnIndex + 1) * 10, 50)}
                      </div>
                      
                      {/* Column droppable area */}
                      <Droppable droppableId={`ranked-${columnIndex}`}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="space-y-2 min-h-[100px]"
                          >
                            {/* Items in this column */}
                            {rankedItems
                              .slice(columnIndex * 10, (columnIndex + 1) * 10)
                              .map((item, rowIndex) => {
                                const overallIndex = columnIndex * 10 + rowIndex;
                                return (
                                  <ListItem
                                    key={item.id}
                                    item={item}
                                    index={rowIndex}
                                    isRanked={true}
                                    movement={getMovementDirection(item.id, overallIndex)}
                                    rank={overallIndex + 1}
                                    isRecentlyAdded={recentlyAddedItemId === item.id}
                                    glowColor={glowSettings.color}
                                    glowBlurRadius={glowSettings.blurRadius}
                                    ref={overallIndex === 0 ? topRankedRef : undefined}
                                  />
                                );
                              })}
                            
                            {/* Empty slots */}
                            {Array.from({ 
                              length: Math.max(0, 10 - rankedItems.slice(columnIndex * 10, (columnIndex + 1) * 10).length) 
                            }).map((_, emptyIndex) => (
                              <div key={`empty-${columnIndex}-${emptyIndex}`} className="h-[88px] opacity-30 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                                <span className="text-gray-400 text-sm">
                                  #{columnIndex * 10 + rankedItems.slice(columnIndex * 10, (columnIndex + 1) * 10).length + emptyIndex + 1}
                                </span>
                              </div>
                            ))}
                            
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Scroll hint */}
              <div className="text-xs text-gray-500 mt-2 text-center">
                ← Scroll horizontally to see all columns →
              </div>
            </div>
          </div>

          <hr className="my-8" />

          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Unranked</h2>
            
            <Droppable droppableId="unranked">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-2 max-w-md md:max-w-[450px] mx-auto px-4"
                >
                  {unrankedItems.map((item, index) => (
                    <ListItem
                      key={item.id}
                      item={item}
                      index={index}
                      isRanked={false}
                      movement={null}
                      isRecentlyAdded={false}
                      glowColor={glowSettings.color}
                      glowBlurRadius={glowSettings.blurRadius}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default App;
