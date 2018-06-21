import { scaleLinear, scaleLog, scaleSqrt } from 'd3-scale'
import * as d3 from 'd3'

import { getData } from './data/data'
import { drawChart } from './chart/chart'
import { drawFrame } from './chart/frame'

import {
    width,
    height,
    initialIncome,
    initialLifeExpectancy,
    speed
} from './chart/config'


const initializeChart = (scales) => {
    drawFrame(scales)
}

const updateData = (scales, data, year) => {
    const yearData = data[year]
    if (yearData) {
        drawChart(scales, year, yearData)
    }    
}

getData.then(data => {
    let currentYear = 1950

    const countries = data[2015]

    const x = scaleLog()
        .domain([initialIncome, d3.max(countries, d => d.income)])
        .range([0, width])

    const y = scaleLinear()
        .domain([initialLifeExpectancy, d3.max(countries, d => d.lifeExpectancy)])
        .range([height, 0])

    const r = scaleSqrt()
        .domain([0, d3.max(countries, d => d.population)])
        .range([0, 10])

    const scales = { x, y, r}

    initializeChart(scales)

    const finalStopTime = 6000
    let stoppedFrames
    setInterval(() => {
        updateData(scales, data, currentYear)
        if (stoppedFrames) {
            stoppedFrames--;
            if (!stoppedFrames) currentYear = 1950
        } else {
            if (++currentYear === 2019) {
                currentYear = 2018
                stoppedFrames = finalStopTime / speed
            }
        }         
    }, speed)
})