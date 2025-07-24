import { Grid } from '@mantine/core';
import { PanInput } from './PanInput';
import { GstinInput } from './GstinInput';
import type { UseFormReturnType } from '@mantine/form';

interface IndianBusinessFieldsProps {
  panProps: any;
  gstinProps?: any;
  tanProps?: any;
}

export function IndianBusinessFields({ panProps, gstinProps, tanProps }: IndianBusinessFieldsProps) {
  return (
    <Grid>
      <Grid.Col span={4}>
        <PanInput
          label="PAN"
          placeholder="ABCDE1234F"
          {...panProps}
        />
      </Grid.Col>
      
      {gstinProps && (
        <Grid.Col span={4}>
          <GstinInput
            label="GSTIN"
            placeholder="22ABCDE1234F1Z5"
            {...gstinProps}
          />
        </Grid.Col>
      )}
      
      {tanProps && (
        <Grid.Col span={4}>
          <PanInput
            label="TAN"
            placeholder="ABCD12345E"
            {...tanProps}
          />
        </Grid.Col>
      )}
    </Grid>
  );
}