const _ = require('lodash/fp')

import income from './raw-income_per_person'
import lifeExpectancy from './raw-life_expectancy'
import population from './raw-population'
import { countriesWithItsContinent } from './countries'

const countryContients = _.flow([
    _.keyBy(x => x.country.toLowerCase()),
    _.mapValues('continent')
])(countriesWithItsContinent)

console.log(_.uniq(Object.values(countryContients)))

const cleanData = ([income, lifeExpectancy, population]) => {
    // Remove unmatched countries
    let countries = _.flow([
        _.map(_.lowerCase),
        _.filter(x => !!x),
        _.groupBy(_.identity),
        _.filter(arr => arr.length === 3),
        _.keyBy(arr => arr[0]),
        _.mapValues(arr => arr[0])
    ])([
        ..._.map('country', income),
        ..._.map('country', lifeExpectancy),
        ..._.map('country', population)
    ])
    
    const selectedCountry = x => !!countries[x.country.toLowerCase()]
    income = income.filter(selectedCountry)
    lifeExpectancy = lifeExpectancy.filter(selectedCountry)
    population = population.filter(selectedCountry)

    return [income, lifeExpectancy, population]
}

const buildData = ([income, lifeExpectancy, population]) => {

    const data = {}   
    const readValues = (rows, key) => {
        rows.forEach(row => {
            for (let year in row) {
                const country = row.country
                let continent = 'unknown'
                if (countryContients[country.toLowerCase()]) {
                    continent = countryContients[country.toLowerCase()]
                }

                if (year !== 'country') {
                    const value = row[year]
                    data[year] = data[year] || {}
                    data[year][country] = data[year][country] || { country }    
                    data[year][country]['continent'] = continent
                    data[year][country][key] = value
                }
            }
        })
    }

    // Put each country income, life expectancy and population
    readValues(income, 'income')
    readValues(lifeExpectancy, 'lifeExpectancy')
    readValues(population, 'population')

    return _.mapValues(_.toArray, data)
}

const formatData = (countries) => {
    for(let year in countries) {
        for(let country in countries[year]) {
            countries[year][country]['population'] = _.replace(/,/g, '')(
                countries[year][country]['population']
            )
            countries[year][country]['population'] = countries[year][country]['population'] != '' ?
                countries[year][country]['population'] : 0.01

            countries[year][country]['income'] = _.replace(/,/g, '')(
                countries[year][country]['income']
            )
            countries[year][country]['income'] = countries[year][country]['income'] != '' ?
                parseInt(countries[year][country]['income']) : 0.01
        }
    }
    return countries
}

const completeData = (countries) => {
    const listOfCountries = countries[2015].map(x => x.country)

    const latestValues = {

    }

    // Complete population    
    for (let year = 1800; year <= 2018; year++) {
        for(let iCountry in listOfCountries) {
            const country = listOfCountries[iCountry]
            if (!countries[year]) {
                countries[year] = {}
            }
            // Only for demo purpose, otherwise use dictionaries
            const thisCountry = _.find(x => x && x.country === country, countries[year])
            if (!thisCountry) {
                countries[year][country] = latestValues[country]
            } else {
                const values = ['population', 'lifeExpectancy', 'income']
                for (let i in values) {
                    const value = values[i]
                    if ((!thisCountry[value] || thisCountry[value] === 0.01) && latestValues[country]) {
                        thisCountry[value] = latestValues[country][value]
                    }
                }                
            }
            latestValues[country] = thisCountry
        }
    }

    countries[2017] = countries[2016]
    countries[2018] = countries[2016]

    return countries
}

const getData = Promise.all([income, lifeExpectancy, population])
    .then(_.flow([
        cleanData,
        buildData,
        formatData,
        completeData
    ]))

export {
    getData
}