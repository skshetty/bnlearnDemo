import React from 'react';
import { BarStack } from '@vx/shape';
//import { Group } from '@vx/group';
//import { Grid } from '@vx/grid';
//import { AxisBottom } from '@vx/axis';
import { cityTemperature } from '@vx/mock-data';
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale';
//import { timeParse, timeFormat } from 'd3-time-format';
//import { withTooltip, Tooltip } from '@vx/tooltip';
//import { LegendOrdinal } from '@vx/legend';
//import { extent, max } from 'd3-array';

const ldata = cityTemperature.slice(0, 12);
console.dir(ldata);

//var renderdata = {"Smoking": {"levels": ["no","yes"],"probability": [0.499496475327291,0.500503524672709]}}
//console.dir(renderdata.Smoking.levels);




const lkeys = Object.keys(ldata[0]).filter(d => d !== 'date');
console.dir(Object.keys(ldata[0]));

//const parseDate = timeParse('%Y%m%d');
//const format = timeFormat('%b %d');
//const formatDate = date => format(parseDate(date));

// accessors
const lx = d => d.date;
console.dir(lx);
const y = d => d.value;
console.log(y);

/*const totals = data.reduce((ret, cur) => {
  const t = keys.reduce((dailyTotal, k) => {
    dailyTotal += +cur[k];
    return dailyTotal;
  }, 0);
  ret.push(t);
  return ret;
}, []);
*/
export default (props) => {
	let {
		width, height,
		margin = {
      			top: 40
    		},
	} = props;
    if (width < 10) return null;
    const data = {"Smoking": {"levels": ["no","yes"],"probability": [0.499496475327291,0.500503524672709]}};
    //const data = {"Smoking": {"yes": 514,"no": 100}};
    const factor = Object.keys(data)[0];
    const innerData = data[factor]
    const levels_data = Object.values(innerData);
    const sum = levels_data.reduce((a,b) => a+b)
    console.log(sum);
    console.dir(factor);
    console.dir(levels_data);
    const keys = Object.keys(innerData);
    console.dir(keys)
    // bounds
    const xMax = width;
    const yMax = height - margin.top - 100;
    const x = () => factor;
    console.dir(x);


    const xScale = scaleBand({
      rangeRound: [0, xMax],
      domain: [innerData].map(x),
      padding: 0.2
    });
    const yScale = scaleLinear({
      rangeRound: [yMax, 0],
      nice: true,
      domain: [0, sum]
    });
    const zScale = scaleOrdinal({
      domain: keys,
      range: ['#6c5efb', '#c998ff']
    });
	return  <div style={{ position: 'relative' }}>
            <svg width={width} height={height}>
            <rect x={0} y={0} width={width} height={height} fill={`#eaedff`} rx={14} />
            <BarStack

            top={margin.top}
            data={[innerData]}
            keys={keys}
            height={yMax}
            x={x}
            xScale={xScale}
            yScale={yScale}
            zScale={zScale}
            />
            </svg>
            </div>
	}