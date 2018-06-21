import './chart.scss'

import * as d3 from 'd3'
import { scaleLinear, scaleLog, scaleSqrt } from 'd3-scale'
import { toDashCase } from '../libs/strings'
const _ = require('lodash/fp')

import {
    width,
    height,
    xOffSet,
    yOffSet,
    initialIncome,
    initialLifeExpectancy,
    speed
} from './config'

const drawChart = ({ x, y, r }, year, countries) => {
    // Chart
    const chart = d3.select('.graph')
    const yearLabel = d3.select('text.year-label')
    const country = chart.selectAll('circle').data(countries)

    yearLabel.text(year)        
    
    country.enter()
        .append('circle')
        .attr('stroke', 'black')
        .attr('stroke-width', 1.5)
        .attr('class', d => `country
            country--continent-${toDashCase(d.continent)}`
        )

    country.exit().remove()

    country.transition()
        .duration(speed)
        .attr('r', d => {
            if (d.country === 'India') console.log(d)
            return r(d.population)
        })
        .attr('cx', d => x(d.income))
        .attr('cy', d => y(d.lifeExpectancy))
}

export {
    drawChart
}