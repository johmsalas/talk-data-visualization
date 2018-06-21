import * as d3 from 'd3'
import urlIncomePerPerson from './source/indicator-gapminder-gdp_per_capita_ppp.csv'

export default d3.csv(urlIncomePerPerson)