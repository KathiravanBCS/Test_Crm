import { Menu, Portal } from '@mantine/core';
import { useState, useEffect, ReactNode } from 'react';

export interface ContextMenuItem<T> {
  label: string;
  icon?: ReactNode;
  onClick: (record: T) => void;
  color?: string;
  hidden?: (record: T) => boolean;
  divider?: boolean;
}

interface RowContextMenuProps<T> {
  items: ContextMenuItem<T>[];
  children: (props: {
    onContextMenu: (e: React.MouseEvent, record: T) => void;
  }) => ReactNode;
}

export function RowContextMenu<T>({ items, children }: RowContextMenuProps<T>) {
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<T | null>(null);

  const handleContextMenu = (e: React.MouseEvent, record: T) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setSelectedRecord(record);
  };

  const handleClose = () => {
    setContextMenuPosition(null);
    setSelectedRecord(null);
  };

  useEffect(() => {
    const handleClick = () => handleClose();
    const handleScroll = () => handleClose();
    
    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll, true);
    
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  return (
    <>
      {children({ onContextMenu: handleContextMenu })}
      
      {contextMenuPosition && selectedRecord && (
        <Portal>
          <Menu
            opened
            onClose={handleClose}
            position="bottom-start"
            offset={0}
            withinPortal
            styles={{
              dropdown: {
                position: 'fixed',
                left: contextMenuPosition.x,
                top: contextMenuPosition.y,
                minWidth: 180
              }
            }}
          >
            <Menu.Dropdown>
              {items
                .filter(item => !item.hidden || !item.hidden(selectedRecord))
                .map((item, index) => (
                  <div key={index}>
                    {item.divider && index > 0 && <Menu.Divider />}
                    <Menu.Item
                      leftSection={item.icon}
                      color={item.color}
                      onClick={() => {
                        item.onClick(selectedRecord);
                        handleClose();
                      }}
                    >
                      {item.label}
                    </Menu.Item>
                  </div>
                ))}
            </Menu.Dropdown>
          </Menu>
        </Portal>
      )}
    </>
  );
}