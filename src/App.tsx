import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import ListItem from './components/ListItem';
import statesData, { StayData } from './data';
import { Analytics } from "@vercel/analytics/react";

const STORAGE_KEY = 'rankedStates';

const App: React.FC = () => {
  const [rankedItems, setRankedItems] = useState<StayData[]>([]);
  const [unrankedItems, setUnrankedItems] = useState<StayData[]>([]);
  const prevRankedRef = useRef<StayData[]>([]);
  const topRankedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedRankedItems = localStorage.getItem(STORAGE_KEY);
    if (savedRankedItems) {
      const parsedRanked = JSON.parse(savedRankedItems);
      const rankedIds = new Set(parsedRanked.map((item: StayData) => item.id));
      const remainingUnranked = statesData.filter((item) => !rankedIds.has(item.id));

      setRankedItems(parsedRanked);
      setUnrankedItems(remainingUnranked);
      prevRankedRef.current = parsedRanked;
    } else {
      setUnrankedItems(statesData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rankedItems));
  }, [rankedItems]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const prevTopId = rankedItems[0]?.id;

    let updatedRanked = [...rankedItems];
    let updatedUnranked = [...unrankedItems];

    const isSameList = source.droppableId === destination.droppableId;

    if (isSameList) {
      const list = source.droppableId === 'ranked' ? [...rankedItems] : [...unrankedItems];
      const [movedItem] = list.splice(source.index, 1);
      list.splice(destination.index, 0, movedItem);

      if (source.droppableId === 'ranked') {
        updatedRanked = list;
      } else {
        updatedUnranked = list;
      }
    } else {
      const sourceList = source.droppableId === 'ranked' ? [...rankedItems] : [...unrankedItems];
      const destList = destination.droppableId === 'ranked' ? [...rankedItems] : [...unrankedItems];

      const [movedItem] = sourceList.splice(source.index, 1);

      if (destList.find((item) => item.id === movedItem.id)) return;

      destList.splice(destination.index, 0, movedItem);

      if (source.droppableId === 'ranked') {
        updatedRanked = destList;
        updatedUnranked = sourceList;
      } else {
        updatedRanked = destList;
        updatedUnranked = sourceList;
      }
    }

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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="max-w-md w-full pt-8 pb-20 px-4 text-center">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <img src="/airbnb.png" alt="Airbnb Logo" className="w-12 h-12" />
            <div>
              <span className="text-sm block">50 States</span>
              <h1 className="text-4xl font-bold">Top Stays</h1>
            </div>
            <span
              className="text-5xl cursor-pointer hover:opacity-80 transition-opacity"
              title="Click to reset rankings"
              onClick={() => {
                const confirmed = window.confirm(
                  "Are you sure you want to reset the rankings? This can't be undone."
                );
                if (confirmed) {
                  setUnrankedItems([...rankedItems, ...unrankedItems]);
                  setRankedItems([]);
                  localStorage.removeItem(STORAGE_KEY);
                }
              }}
            >
              🏆
            </span>
          </div>

          {/* Ranked Items */}
          <Droppable droppableId="ranked">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="mb-8 p-4"
              >
                <h2 className="text-2xl font-bold mb-4">Ranked</h2>
                {rankedItems.map((item, index) => (
                  <ListItem
                    key={item.id}
                    item={item}
                    index={index}
                    isRanked={true}
                    movement={getMovementDirection(item.id, index)}
                    ref={index === 0 ? topRankedRef : undefined}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <hr className="my-4" />

          {/* Unranked Items */}
          <Droppable droppableId="unranked">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="p-4"
              >
                <h2 className="text-2xl font-bold mb-4">Unranked</h2>
                {unrankedItems.map((item, index) => (
                  <ListItem
                    key={item.id}
                    item={item}
                    index={index}
                    isRanked={false}
                    movement={null}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
      <Analytics />
    </DragDropContext>
  );
};

export default App;
