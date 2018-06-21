import './frame.scss'

const _ = require('lodash/fp')
import * as d3 from 'd3'

import { 
    width,
    height,
    xOffSet,
    yOffSet,
    initialIncome,
    initialLifeExpectancy
} from './config'

const drawLifeExpectancyLabels = (svg, x, y) => {
    
    const labels = [20, 30, 40, 50, 60, 70, 80, 90]

    const lifeExpLabels = svg.append('svg')
    lifeExpLabels.attr('y', yOffSet)
    
    const label = lifeExpLabels.selectAll('g')
            .data(labels)
        .enter().append('g')

    label.append('text')
        .text(_.identity)
        .attr('class', 'axe-label--life-expectancy')
        .attr('x', xOffSet)
        .attr('y', d => y(d))
        .attr('dy', 5)
        .attr('dx', -45)

    label.append('line')
        .attr('stroke', '#e3eef0')
        .attr('stroke-width', 2)
        .attr('x1', d => x(initialIncome) + xOffSet)
        .attr('y1', d => y(d))
        .attr('x2', d => x(128000) + xOffSet)
        .attr('y2', d => y(d))
}

const drawIncomeLabels = (svg, x, y) => {
    
    // Labels for logarithmic scale
    const labels = [500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000]

    // Labels for linear scale
    //const labels = [25000, 50000, 75000, 100000, 125000]

    const incomeLabels = svg.append('svg')
    incomeLabels.attr('y', yOffSet)

    const label = incomeLabels.selectAll('g')
            .data(labels)
        .enter().append('g')

    label.append('text')
        .text(x => x < 10000 ? x : `${ x / 1000}k`)
        .attr('class', 'axe-label--income')
        .attr('x', d => x(d) + xOffSet)
        .attr('y', y(initialLifeExpectancy))
        .attr('dy', 35)
        .attr('dx', -20)

    label.append('line')
        .attr('stroke', '#e3eef0')
        .attr('stroke-width', 2)
        .attr('x1', d => x(d) + xOffSet)
        .attr('y1', d => y(initialLifeExpectancy))
        .attr('x2', d => x(d) + xOffSet)
        .attr('y2', d => y(90))
}

const drawAxes = (svg, x, y) => {

    // Income axe
    svg.append('line')
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('x1', d => x(initialIncome) + xOffSet)
        .attr('y1', d => y(initialLifeExpectancy) + yOffSet)
        .attr('x2', d => x(initialIncome) + xOffSet)
        .attr('y2', d => y(90) + yOffSet)

    svg.append('text')
        .text('Ingresos')
        .attr('class', 'axe-title axe-title--income')
        .attr('x', xOffSet + (width / 2))
        .attr('y', yOffSet + height)
        .attr('dy', 70)
        .attr('dx', -40)

    // Life Expectancy axe
    svg.append('line')
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('x1', d => x(initialIncome) + xOffSet)
        .attr('y1', d => y(initialLifeExpectancy) + yOffSet)
        .attr('x2', d => x(128000) + xOffSet)
        .attr('y2', d => y(initialLifeExpectancy) + yOffSet)

    svg.append('text')
        .text('Esperanza de vida')
        .attr('class', 'axe-title axe-title--life-expectancy')
        .attr('transform', `translate(${x(initialIncome) + xOffSet},
            ${y(43) + yOffSet}) rotate(-90)`)
        .attr('dy', -80)
        .attr('dx', -40)

    
}

const drawFrame = ({ x, y}) => {

    const svg = d3.select('.chart')
    svg.attr('width', width + xOffSet + 100).attr('height', height + 2 * yOffSet + 30)

    svg.append('text')
        .attr('class', 'year-label')
        .attr('x', 350)
        .attr('y', 370)

    drawLifeExpectancyLabels(svg, x, y)
    drawIncomeLabels(svg, x, y)
    drawAxes(svg, x, y)

    const graph = svg.append('svg')
        .attr('class', 'graph')
        .attr('x', 50).attr('y', 50)        

}

export {
    drawFrame
}