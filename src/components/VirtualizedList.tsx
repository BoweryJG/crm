import React, { memo, useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { FixedSizeList as List, areEqual } from 'react-window';
import { Box, CircularProgress } from '@mui/material';
import usePerformanceMonitoring from '../hooks/usePerformanceMonitoring';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number, isVisible: boolean) => React.ReactNode;
  height: number;
  width?: string | number;
  overscan?: number;
  onItemsRendered?: (startIndex: number, endIndex: number) => void;
  className?: string;
}

interface ItemRendererProps<T> {
  index: number;
  style: React.CSSProperties;
  data: {
    items: T[];
    renderItem: (item: T, index: number, isVisible: boolean) => React.ReactNode;
  };
}

// Memoized item renderer to prevent unnecessary re-renders
const ItemRenderer = memo<ItemRendererProps<any>>(({ index, style, data }) => {
  const item = data.items[index];
  const content = data.renderItem(item, index, true);

  return (
    <div style={style}>
      {content}
    </div>
  );
}, areEqual);

ItemRenderer.displayName = 'VirtualizedItemRenderer';

function VirtualizedList<T>({
  items,
  itemHeight,
  renderItem,
  height,
  width = '100%',
  overscan = 3,
  onItemsRendered,
  className = ''
}: VirtualizedListProps<T>) {
  const [isScrolling, setIsScrolling] = useState(false);
  const listRef = useRef<List>(null);
  const { measureInteraction } = usePerformanceMonitoring();

  // Memoize the item data to prevent recreation on every render
  const itemData = useMemo(
    () => ({
      items,
      renderItem
    }),
    [items, renderItem]
  );

  // Handle scroll state changes
  const handleItemsRendered = useCallback(
    ({ visibleStartIndex, visibleStopIndex }: any) => {
      if (onItemsRendered) {
        onItemsRendered(visibleStartIndex, visibleStopIndex);
      }
    },
    [onItemsRendered]
  );

  // Performance monitoring for scroll interactions
  const handleScroll = useCallback(() => {
    if (!isScrolling) {
      setIsScrolling(true);
      const endInteraction = measureInteraction('virtual_scroll');
      
      // Reset scrolling state after scroll ends
      setTimeout(() => {
        setIsScrolling(false);
        endInteraction();
      }, 150);
    }
  }, [isScrolling, measureInteraction]);

  // Scroll to specific item
  const scrollToItem = useCallback((index: number, align: 'start' | 'center' | 'end' | 'smart' = 'smart') => {
    if (listRef.current) {
      listRef.current.scrollToItem(index, align);
    }
  }, []);

  // Auto-scroll to top when items change significantly
  useEffect(() => {
    if (listRef.current && items.length > 0) {
      listRef.current.scrollToItem(0);
    }
  }, [items.length]);

  // Loading state for empty items
  if (items.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height,
          width
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      className={className}
      sx={{
        width,
        height,
        '& .virtual-list-container': {
          // Hide scrollbar on mobile for cleaner UI
          '@media (max-width: 768px)': {
            '&::-webkit-scrollbar': {
              width: '2px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '1px'
            }
          }
        }
      }}
    >
      <List
        ref={listRef}
        className="virtual-list-container"
        height={height}
        itemCount={items.length}
        itemSize={itemHeight}
        itemData={itemData}
        overscanCount={overscan}
        onItemsRendered={handleItemsRendered}
        onScroll={handleScroll}
        width={width}
      >
        {ItemRenderer}
      </List>
    </Box>
  );
}

// Higher-order component for memoizing the entire list
const MemoizedVirtualizedList = memo(VirtualizedList) as <T>(
  props: VirtualizedListProps<T>
) => React.ReactElement;

MemoizedVirtualizedList.displayName = 'VirtualizedList';

export default MemoizedVirtualizedList;