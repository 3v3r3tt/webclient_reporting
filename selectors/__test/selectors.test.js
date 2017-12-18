import { expect } from 'chai'

import {
  getIncidentFrequencyFilledBuckets
} from '../index'

import * as IncidentFrequencyFixture from './incident-frequency-fixture'

describe('Reporting Selectors Tests', function () {
  describe('incident frequency daily data', function () {
    it('can fill empty day buckets in data based on request dates', function () {
      expect(getIncidentFrequencyFilledBuckets(IncidentFrequencyFixture.displayDailyState))
        .to.deep.equal(IncidentFrequencyFixture.displayDailyFilledResponse)
    })
  })

  describe('incident frequency weekly data', function () {
    it('can fill empty week buckets in data based on request dates', function () {
      expect(getIncidentFrequencyFilledBuckets(IncidentFrequencyFixture.displayWeeklyState))
        .to.deep.equal(IncidentFrequencyFixture.displayWeeklyFilledResponse)
    })
  })

  describe('incident frequency montly data', function () {
    it('can fill empty month buckets in data based on request dates', function () {
      expect(getIncidentFrequencyFilledBuckets(IncidentFrequencyFixture.displayMonthlyState))
        .to.deep.equal(IncidentFrequencyFixture.displayMonthlyFilledResponse)
    })
  })
})
