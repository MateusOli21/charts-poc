import React, { useCallback, useMemo } from 'react';
import { timeFormat } from 'd3-time-format';
import { max, extent, bisector, min } from 'd3-array';
import { AreaClosed, Line, Bar, LinePath } from '@visx/shape';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { curveMonotoneX } from '@visx/curve';
import { GridColumns, GridRows } from '@visx/grid';
import { scaleLinear, scaleTime } from '@visx/scale';
import {
  withTooltip,
  Tooltip,
  TooltipWithBounds,
  defaultStyles,
} from '@visx/tooltip';

import { historicOne, historicTwo } from '@providers/mocks';
import { IBaseStock } from '@shared/types/IBaseStock';

type TooltipData = IBaseStock;

export const background = '#205ecf';
export const background2 = '#0f2c61';
export const accentColor = '#9ebbf0';
export const accentColorDark = '#6794e8';

const tooltipStyles = {
  ...defaultStyles,
  background,
  border: '1px solid white',
  color: 'white',
};

export type AreaProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

// util
const formatDate = timeFormat("%b %d, '%y");

// accessors
const getDate = (d: IBaseStock) => new Date(d.date);
const getStockValue = (d: IBaseStock) => Number((d.return * 1000).toFixed(2));
const bisectDate = bisector<IBaseStock, Date>(d => new Date(d.date)).left;

export default withTooltip<AreaProps, TooltipData>(
  ({
    width,
    height,
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  }: AreaProps & WithTooltipProvidedProps<TooltipData>) => {
    if (width < 10) return null;

    // bounds
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // scales
    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [margin.left, innerWidth + margin.left],
          domain: extent(historicOne, getDate) as [Date, Date],
        }),
      [innerWidth, margin.left],
    );

    const stockValueScale = useMemo(
      () =>
        scaleLinear({
          range: [innerHeight + margin.top, margin.top],
          domain: [
            // -150,
            (min(historicOne, getStockValue) || -200) * 2,
            (max(historicOne, getStockValue) || 0) + innerHeight / 3,
          ],
          nice: true,
        }),
      [innerHeight, margin.top],
    );

    // tooltip handler
    const handleTooltip = useCallback(
      (
        event:
          | React.TouchEvent<SVGRectElement>
          | React.MouseEvent<SVGRectElement>,
      ) => {
        const { x } = localPoint(event) || { x: 0 };

        const x0 = dateScale.invert(x);
        const index = bisectDate(historicOne, x0, 1);

        const d0 = historicOne[index - 1];
        const d1 = historicOne[index];

        let d = d0;

        if (d1 && getDate(d1)) {
          d =
            x0.valueOf() - getDate(d0).valueOf() >
            getDate(d1).valueOf() - x0.valueOf()
              ? d1
              : d0;
        }

        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: stockValueScale(getStockValue(d)),
        });
      },
      [showTooltip, stockValueScale, dateScale],
    );

    return (
      <div>
        <svg width={width} height={height}>
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="url(#area-background-gradient)"
            rx={14}
          />

          {/* base structure of chart */}
          <LinearGradient
            id="area-background-gradient"
            from={background}
            to={background2}
          />
          <LinearGradient
            id="area-gradient"
            from="rgba(255,255,255,0.4)"
            to="rgba(255,255,255,0.1)"
            toOpacity={0.1}
          />

          <GridRows
            left={margin.left}
            scale={stockValueScale}
            width={innerWidth}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0}
            pointerEvents="none"
          />
          <GridColumns
            top={margin.top}
            scale={dateScale}
            height={innerHeight}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0.2}
            pointerEvents="none"
          />

          {/* crate chart line */}
          <AreaClosed<IBaseStock>
            data={historicOne}
            x={d => dateScale(getDate(d)) ?? 0}
            y={d => stockValueScale(getStockValue(d)) ?? 0}
            yScale={stockValueScale}
            curve={curveMonotoneX}
            strokeWidth={0.2}
            fillOpacity={0.3}
            stroke="url(#area-gradient)"
            fill="url(#area-gradient)"
          />

          <LinePath<IBaseStock>
            data={historicOne}
            key={Math.random()}
            x={d => dateScale(getDate(d)) ?? 0}
            y={d => stockValueScale(getStockValue(d)) ?? 0}
            curve={curveMonotoneX}
            strokeWidth={1.25}
            stopOpacity={0.1}
            stroke="white"
          />

          {/* create hide bar */}
          <Bar
            x={margin.left}
            y={margin.top}
            width={innerWidth}
            height={innerWidth}
            rx={14}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
            fill="transparent"
          />

          {/* create dot to show where pointer are */}
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: margin.top }}
                to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                stroke={accentColorDark}
                strokeWidth={1.5}
                pointerEvents="none"
                strokeDasharray="5"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                r={4}
                pointerEvents="none"
                stroke="white"
                strokeWidth={1.5}
                strokeOpacity={0.1}
                fill="white"
                fillOpacity={0.1}
              />

              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill={accentColorDark}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
            </g>
          )}
        </svg>

        {tooltipData && (
          <div>
            {/* create tooltip inside chart */}
            <TooltipWithBounds
              key={Math.random()}
              top={tooltipTop - 12}
              left={tooltipLeft + 12}
              style={tooltipStyles}
            >
              {`$${getStockValue(tooltipData)}`}
            </TooltipWithBounds>

            {/* create bottom tooltip */}
            <Tooltip
              top={innerHeight + margin.top - 14}
              left={tooltipLeft}
              style={{
                ...defaultStyles,
                minWidth: 64,
                textAlign: 'center',
                transform: 'translateX(-50%)',
              }}
            >
              {formatDate(getDate(tooltipData))}
            </Tooltip>
          </div>
        )}
      </div>
    );
  },
);
