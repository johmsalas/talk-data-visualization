import * as d3 from 'd3'
import urlPopulation from './source/indicator-gapminder-population.csv'

export default d3.csv(urlPopulation)