import * as d3 from 'd3'
import urlLifeExpectancy from './source/indicator-life_expectancy_at_birth.csv'

export default d3.csv(urlLifeExpectancy)