import React from 'react';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { LinearGradient } from '@visx/gradient';
import { curveMonotoneX } from '@visx/curve';
import { LinePath } from '@visx/shape';
import { Text } from '@visx/text';
import { scaleLinear } from '@visx/scale';

import { tenDaysData, tenDaysAltData } from '@providers/mocks';

import { xScaleAxis, yScaleAxis } from './scales';

type ComponentProps = {
  width: number;
  height: number;
  padding: number;
  chatTitle?: string;
};

const colors = {
  white: '#FFFFFF',
  black: '#1B1B1B',
  gray: '#98A7C0',
  darkGray: '#2A2A2A',
  accent: '#40FEAE',
  darkAccent: '#256769',
  accentAlt: '#0082ed',
  darkAccentAlt: '#00325b',
  yellow: '#ede000',
  yellowDark: '#807900',
};

const chartLinesData = [tenDaysData, tenDaysAltData];

export const PriceEvolutionChart: React.FC<ComponentProps> = ({
  width,
  height,
  padding,
  chatTitle,
}) => {
  const xScaleLine = scaleLinear({
    domain: [1, 10],
    range: [0 + padding * 2, width - padding * 2],
  });

  const yScaleLine = scaleLinear({
    domain: [0, 50],
    range: [height - padding * 2, padding * 3],
  });

  const gradientsOptions = [
    { line: 'line-gradient', background: 'background-gradient' },
    { line: 'line-alt-gradient', background: 'background-alt-gradient' },
    { line: 'line-yellow-gradient', background: 'background-yellow-gradient' },
  ];

  return (
    <svg width={width} height={height}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={14}
        fill={colors.black}
      />

      <LinearGradient
        id="line-gradient"
        from={colors.accent}
        to={colors.darkAccent}
      />
      <LinearGradient
        id="line-alt-gradient"
        from={colors.accentAlt}
        to={colors.darkAccentAlt}
      />
      <LinearGradient
        id="line-yellow-gradient"
        from={colors.yellow}
        to={colors.yellowDark}
      />

      <LinearGradient
        id="background-gradient"
        from={colors.darkAccent}
        to={colors.black}
        fromOpacity={0.35}
        toOpacity={0.05}
      />
      <LinearGradient
        id="background-alt-gradient"
        from={colors.darkAccentAlt}
        to={colors.black}
        fromOpacity={0.35}
        toOpacity={0.05}
      />
      <LinearGradient
        id="background-yellow-gradient"
        from={colors.yellowDark}
        to={colors.black}
        fromOpacity={0.35}
        toOpacity={0.05}
      />

      <Text
        x={padding / 2}
        y={padding * 1.5}
        style={{ fill: colors.white, fontSize: 20, fontWeight: 600 }}
      >
        {chatTitle}
      </Text>

      <AxisBottom
        hideZero
        scale={xScaleAxis(width, padding * 2)}
        top={height - padding * 2}
        stroke={colors.darkGray}
        strokeWidth={1.25}
        tickStroke={colors.darkGray}
        tickLabelProps={() => ({
          fill: colors.gray,
          textAnchor: 'middle',
          verticalAnchor: 'middle',
        })}
      />

      <AxisLeft
        scale={yScaleAxis(height, padding)}
        hideZero
        numTicks={5}
        left={padding * 2}
        stroke={colors.darkGray}
        strokeWidth={1.25}
        tickStroke={colors.darkGray}
        tickLabelProps={() => ({
          fill: colors.gray,
          textAnchor: 'end',
          verticalAnchor: 'middle',
        })}
        tickFormat={value => `$${value}`}
      />

      <LinePath
        data={tenDaysData}
        x={data => xScaleLine(data[0])}
        y={data => yScaleLine(data[1])}
        stroke="url(#line-gradient)"
        strokeWidth={2}
        curve={curveMonotoneX}
        fill="url(#background-gradient)"
      />

      <LinePath
        data={tenDaysAltData}
        x={data => xScaleLine(data[0])}
        y={data => yScaleLine(data[1])}
        stroke="url(#line-alt-gradient)"
        strokeWidth={2}
        curve={curveMonotoneX}
        fillOpacity={0.15}
        fill="url(#background-alt-gradient)"
      />

      {chartLinesData.map((lineData, index) => {
        const gradientIndex = Math.floor(
          Math.random() * gradientsOptions.length,
        );

        return (
          <LinePath
            key={index}
            data={lineData}
            x={data => xScaleLine(data[0])}
            y={data => yScaleLine(data[1])}
            stroke={`url(#${gradientsOptions[gradientIndex].line})`}
            strokeWidth={2}
            curve={curveMonotoneX}
            fill={`url(#${gradientsOptions[gradientIndex].background})`}
          />
        );
      })}
    </svg>
  );
};
