import { Menu, Button } from '@mantine/core';
import { IconDownload, IconFileTypeCsv, IconFileTypeXls } from '@tabler/icons-react';
import { useState } from 'react';

interface ExportMenuProps {
  onExport: (format: 'csv' | 'excel') => Promise<void> | void;
  disabled?: boolean;
}

export function ExportMenu({ onExport, disabled = false }: ExportMenuProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: 'csv' | 'excel') => {
    setExporting(true);
    try {
      await onExport(format);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button
          variant="default"
          leftSection={<IconDownload size={16} />}
          loading={exporting}
          disabled={disabled}
        >
          Export
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconFileTypeCsv size={16} />}
          onClick={() => handleExport('csv')}
        >
          Export as CSV
        </Menu.Item>
        <Menu.Item
          leftSection={<IconFileTypeXls size={16} />}
          onClick={() => handleExport('excel')}
        >
          Export as Excel
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}