/*import React from 'react';
import { BarStack } from '@vx/shape';
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale';
import { AxisBottom } from '@vx/axis';
import { cdata} from '@vx/mock-data'; 

const data = cdata;
const x_keys = ["Smoking"];

export default (props) => { 
	let {
		width, height,
		margin = {
      			top: 40	
    		},
	} = props;
		
	const keys = [0,1];
	if (width < 10) return null;
    	// bounds
    	const xMax = width;
    	const yMax = height - margin.top - 100;
    	const xScale = scaleBand({
		domain: x_keys,
		rangeRound: [0, xMax],
		padding: 0.2
    	});
    	const yScale = scaleLinear({
      		rangeRound: [yMax, 0],
      		nice: true,
      		domain: [0, 5000]
    	});
    	const zScale = scaleOrdinal({
      		domain: keys,
      		range: ['#6c5efb', '#c998ff']
    	});
	return <BarStack
	    top={margin.top}
            data={data}
            keys={keys}
            height={yMax}
            x={x_keys[0]}
            xScale={xScale}
            yScale={yScale}
            zScale={zScale} />
	}
*/
import React from 'react';
import { BarStack } from '@vx/shape';
import { Group } from '@vx/group';
import { Grid } from '@vx/grid';
import { AxisBottom } from '@vx/axis';
import { cityTemperature } from '@vx/mock-data';
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale';
import { timeParse, timeFormat } from 'd3-time-format';
import { withTooltip, Tooltip } from '@vx/tooltip';
import { LegendOrdinal } from '@vx/legend';
import { extent, max } from 'd3-array';

const data = cityTemperature.slice(0, 12);

//const keys = Object.keys(data[0]).filter(d => d !== 'date');
const keys = [0,1];
console.dir(keys);
const x_keys = ["Smoking", "Family", "Pressure", "Proteins"];
console.dir(x_keys)
const parseDate = timeParse('%Y%m%d');
const format = timeFormat('%b %d');
const formatDate = date => format(parseDate(date));

// accessors
const x = d => d.date;
const y = d => d.value;

/*const totals = data.reduce((ret, cur) => {
  const t = keys.reduce((dailyTotal, k) => {
    dailyTotal += +cur[k];
    return dailyTotal;
  }, 0);
  ret.push(t);
  return ret;
}, []);*/
const totals = 100;

export default withTooltip(
  ({
    width,
    height,
    events = false,
    onClick,
    margin = {
      top: 40
    },
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip
  }) => {
    if (width < 10) return null;

    // bounds
    const xMax = width;
    const yMax = height - margin.top - 100;

    // // scales
    /*const xScale = scaleBand({
      rangeRound: [0, xMax],
      domain: data.map(x),
      padding: 0.2,
      tickFormat: () => val => formatDate(val)
    });*/
    const xScale = scaleBand({
	domain: x_keys,
	rangeRound: [0, xMax],
	padding: 0.2
    });
    console.dir(xScale);
    const yScale = scaleLinear({
      rangeRound: [yMax, 0],
      nice: true,
      domain: [0, max(totals)]
    });
    const zScale = scaleOrdinal({
      domain: keys,
      range: ['#6c5efb', '#c998ff']
    });

    let tooltipTimeout;

    return (
      <div style={{ position: 'relative' }}>
        <svg width={width} height={height}>
          <rect x={0} y={0} width={width} height={height} fill={`#eaedff`} rx={14} />
          <Grid
            top={margin.top}
            left={margin.left}
            xScale={xScale}
            yScale={yScale}
            width={xMax}
            height={yMax}
            stroke={'black'}
            strokeOpacity={0.1}
            xOffset={xScale.bandwidth() / 2}
          />
          <BarStack
            top={margin.top}
            data={data}
            keys={keys}
            height={yMax}
            x={x}
            xScale={xScale}
            yScale={yScale}
            zScale={zScale}
            onClick={data => event => {
              if (onClick) onClick(data)
              //alert(`clicked: ${JSON.stringify(data)}`);
            }}
            onMouseLeave={data => event => {
              tooltipTimeout = setTimeout(() => {
                hideTooltip();
              }, 300);
            }}
            onMouseMove={data => event => {
              if (tooltipTimeout) clearTimeout(tooltipTimeout);
              const top = event.clientY - margin.top - data.height;
              const left = xScale(data.x) + data.width + data.paddingInner * data.step / 2;
              showTooltip({
                tooltipData: data,
                tooltipTop: top,
                tooltipLeft: left
              });
            }}
          />
          <AxisBottom
            scale={xScale}
            top={yMax + margin.top}
            stroke="#a44afe"
            tickStroke="#a44afe"
            tickLabelProps={(value, index) => ({
              fill: '#a44afe',
              fontSize: 11,
              textAnchor: 'middle'
            })}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            top: margin.top / 2 - 10,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            fontSize: '14px'
          }}
        >
          <LegendOrdinal scale={zScale} direction="row" labelMargin="0 15px 0 0" />
        </div>
        {tooltipOpen && (
          <Tooltip
            top={tooltipTop}
            left={tooltipLeft}
            style={{
              minWidth: 60,
              backgroundColor: 'rgba(0,0,0,0.9)',
              color: 'white'
            }}
          >
            <div style={{ color: zScale(tooltipData.key) }}>
              <strong>{tooltipData.key}</strong>
            </div>
            <div>{tooltipData.data[tooltipData.key]}℉</div>
            <div>
              <small>{tooltipData.xFormatted}</small>
            </div>
          </Tooltip>
        )}
      </div>
    );
  }
);




