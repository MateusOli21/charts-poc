import React, { useMemo } from 'react';

import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GradientTealBlue } from '@visx/gradient';
import { scaleBand, scaleLinear } from '@visx/scale';
import letterFrequency, {
  LetterFrequency,
} from '@visx/mock-data/lib/mocks/letterFrequency';

export type BarsProps = {
  width: number;
  height: number;
  events?: boolean;
};

const white200 = '#efefef';
const data = letterFrequency.slice(5);
const verticalMargin = 120;

// accessors
const getLetter = (d: LetterFrequency) => d.letter;
const getLetterFrequency = (d: LetterFrequency) => Number(d.frequency) * 100;

export const SimpleBarChart: React.FC<BarsProps> = ({ width, height }) => {
  const xMax = width;
  const yMax = height - verticalMargin;

  // axis scales
  const bottomScale = scaleBand<string>({
    domain: data.map(getLetter),
    range: [0, xMax],
    padding: 0.3,
  });

  const leftScale = scaleLinear({
    domain: [
      Math.min(...data.map(d => Math.min(d.frequency * 100))),
      Math.max(...data.map(d => Math.max(d.frequency * 100))),
    ],
    nice: true,
    range: [yMax, 0],
  });

  // bars scale
  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, xMax],
        round: true,
        domain: data.map(getLetter),
        padding: 0.1,
      }),
    [xMax],
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...data.map(getLetterFrequency))],
      }),
    [yMax],
  );

  return width < 10 ? null : (
    <svg width={width + 120} height={height}>
      <GradientTealBlue id="teal" />
      <rect
        x={0}
        y={0}
        width={width + 120}
        height={height}
        fill="url(#teal)"
        rx={8}
      />

      <Group top={verticalMargin / 2} left={68}>
        {data.map(d => {
          const letter = getLetter(d);
          const barWidth = xScale.bandwidth();
          const barHeight = yMax - (yScale(getLetterFrequency(d)) ?? 0);

          const barX = xScale(letter);
          const barY = yMax - barHeight;

          return (
            <Bar
              key={`bar-${letter}`}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill="rgba(226, 243, 245, .75)"
            />
          );
        })}

        <AxisLeft
          left={-8}
          scale={leftScale}
          stroke={white200}
          tickStroke={white200}
          tickLabelProps={() => ({
            fontSize: 10,
            textAnchor: 'end',
            fill: white200,
          })}
        />
        <AxisBottom
          top={yMax + 8}
          scale={bottomScale}
          numTicks={data.length}
          stroke={white200}
          tickStroke={white200}
          rangePadding={0}
          tickLabelProps={() => ({
            fontSize: 10,
            textAnchor: 'middle',
            fill: white200,
          })}
        />
      </Group>
    </svg>
  );
};
