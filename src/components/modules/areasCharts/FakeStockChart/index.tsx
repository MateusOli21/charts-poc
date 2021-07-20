import React, { useCallback, useMemo } from 'react';
import { timeFormat } from 'd3-time-format';
import { max, extent, bisector, min } from 'd3-array';
import { AreaClosed, Line, Bar, LinePath } from '@visx/shape';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { withTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { scaleLinear, scaleTime } from '@visx/scale';
import { GridColumns, GridRows } from '@visx/grid';
import { LinearGradient } from '@visx/gradient';
import { curveMonotoneX } from '@visx/curve';
import { localPoint } from '@visx/event';
import { Group } from '@visx/group';

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
const getStockValue = (d: IBaseStock) =>
  Number((d.accumulatedReturn * 1000).toFixed(2));
const bisectDate = bisector<IBaseStock, Date>(d => new Date(d.date)).left;

export default withTooltip<AreaProps, TooltipData>(
  ({
    width,
    height,
    margin = { top: 12, right: 0, bottom: 12, left: 12 },
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
          range: [margin.left + 24, innerWidth],
          domain: extent(historicOne, getDate) as [Date, Date],
        }),
      [innerWidth, margin.left],
    );

    const stockValueScale = useMemo(
      () =>
        scaleLinear({
          range: [innerHeight - margin.top, margin.top * 2],
          domain: [
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
          | React.TouchEvent<SVGPathElement>
          | React.MouseEvent<SVGPathElement>,
        historic: IBaseStock[],
      ) => {
        const { x } = localPoint(event) || { x: 0 };

        const x0 = dateScale.invert(x);
        const index = bisectDate(historic, x0, 1);

        const d0 = historic[index - 1];
        const d1 = historic[index];

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
            fill="url(#area-bg-gradient)"
            rx={12}
          />

          <Group left={0}>
            <AxisLeft
              scale={stockValueScale}
              stroke="gray"
              tickStroke="gray"
              strokeWidth={1.2}
              left={margin.left * 3}
              tickLength={8}
              tickLabelProps={() => ({
                fontSize: 10,
                textAnchor: 'end',
                verticalAnchor: 'middle',
                fill: 'white',
              })}
            />
            <AxisBottom
              rangePadding={-4}
              top={height - margin.top * 3}
              scale={dateScale}
              stroke="gray"
              tickStroke="gray"
              strokeWidth={1.5}
              tickLabelProps={() => ({
                fontSize: 10,
                textAnchor: 'middle',
                verticalAnchor: 'middle',
                fill: 'white',
              })}
            />

            {/* base structure of chart */}
            <LinearGradient id="area-bg-gradient" from="#252525" to="#161616" />
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
              key={Math.random()}
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
              strokeWidth={1.5}
              // stopOpacity={0.1}
              stroke="white"
            />

            {/* second line */}
            <AreaClosed<IBaseStock>
              key={Math.random()}
              data={historicTwo}
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
              data={historicTwo}
              key={Math.random()}
              x={d => dateScale(getDate(d)) ?? 0}
              y={d => stockValueScale(getStockValue(d)) ?? 0}
              curve={curveMonotoneX}
              strokeWidth={1.5}
              stroke={background}
              onTouchStart={e => handleTooltip(e, historicOne)}
              onTouchMove={e => handleTooltip(e, historicOne)}
              onMouseMove={e => handleTooltip(e, historicOne)}
              onMouseLeave={() => hideTooltip()}
            />

            {/* create hide bar */}
            {/* <Bar
              key={Math.random()}
              x={margin.left}
              y={margin.top}
              width={innerWidth - margin.top}
              height={innerWidth}
              rx={14}
              onTouchStart={e => handleTooltip(e, historicOne)}
              onTouchMove={e => handleTooltip(e, historicOne)}
              onMouseMove={e => handleTooltip(e, historicOne)}
              onMouseLeave={() => hideTooltip()}
              fill="transparent"
            /> */}

            {/* <Bar
              key={Math.random()}
              x={margin.left}
              y={margin.top}
              width={innerWidth}
              height={innerWidth}
              rx={14}
              onTouchStart={e => handleTooltip(e, historicTwo)}
              onTouchMove={e => handleTooltip(e, historicTwo)}
              onMouseMove={e => handleTooltip(e, historicTwo)}
              onMouseLeave={() => hideTooltip()}
              fill="transparent"
            /> */}

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
          </Group>
        </svg>

        {tooltipData && (
          <div>
            {/* create tooltip inside chart */}
            <TooltipWithBounds
              top={tooltipTop - 12}
              left={tooltipLeft + 12}
              style={tooltipStyles}
            >
              {`R$${getStockValue(tooltipData)} - ${formatDate(
                getDate(tooltipData),
              )}`}
            </TooltipWithBounds>
          </div>
        )}
      </div>
    );
  },
);
