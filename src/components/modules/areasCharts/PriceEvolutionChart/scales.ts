import { scaleLinear } from '@visx/scale';

export const xScaleAxis = (width: number, padding: number) =>
  scaleLinear({
    domain: [1, 10],
    range: [0 + padding, width - padding],
  });

export const yScaleAxis = (height: number, padding: number) =>
  scaleLinear({
    domain: [0, 50],
    range: [height - padding, padding * 3],
  });
