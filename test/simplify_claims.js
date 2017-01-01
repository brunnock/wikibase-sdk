const should = require('should')
const _ = require('lodash')
const Q571 = require('./data/Q571.json')
const Q4132785 = require('./data/Q4132785.json')
const Q328212 = require('./data/Q328212.json')
const Q22002395 = require('./data/Q22002395.json')
const Q2112 = require('./data/Q2112.json')

// a fake entity to simulate a possible negative invalid date
const Q4132785NegativeDate = require('./data/Q4132785-negative-date.json')

const { simplifyClaim, simplifyPropertyClaims, simplifyClaims } = require('../lib/helpers/simplify_claims')

describe('simplifyClaims', function () {
  it('env', function (done) {
    Q571.should.be.an.Object()
    Q571.claims.should.be.ok()
    Q4132785.should.be.an.Object()
    Q4132785.claims.P577[0].should.be.ok()
    done()
  })

  it('should return an object', function (done) {
    simplifyClaims(Q571.claims).should.be.an.Object()
    done()
  })

  it('should return an object of same length', function (done) {
    const originalLength = Object.keys(Q571.claims).length
    const simplified = simplifyClaims(Q571.claims)
    const newLength = Object.keys(simplified).length
    newLength.should.equal(originalLength)
    done()
  })

  it('should return an indexed collection of arrays', function (done) {
    const simplified = simplifyClaims(Q571.claims)
    for (let key in simplified) {
      simplified[key].should.be.an.Array()
    }
    done()
  })

  it('should pass entity and property prefixes down', function (done) {
    const simplified = simplifyClaims(Q2112.claims, 'wd')
    simplified.P190[0].should.equal('wd:Q207614')
    const simplified2 = simplifyClaims(Q2112.claims, null, 'wdt')
    simplified2['wdt:P123456789'][0].should.equal('wdt:P207614')
    done()
  })

  it('should return prefixed properties if passed a property prefix', function (done) {
    const simplified = simplifyClaims(Q2112.claims, 'wd', 'wdt')
    simplified['wdt:P190'].should.be.an.Array()
    simplified['wdt:P190'][0].should.equal('wd:Q207614')
    const simplified2 = simplifyClaims(Q2112.claims, null, 'wdt')
    simplified2['wdt:P123456789'][0].should.equal('wdt:P207614')
    done()
  })
})

describe('simplifyPropertyClaims', function () {
  it('should return an arrays', function (done) {
    const simplified = simplifyPropertyClaims(Q571.claims.P487)
    simplified.should.be.an.Array()
    done()
  })

  it('should keep only non-null values', function (done) {
    const simplified = simplifyPropertyClaims(Q22002395.claims.P50)
    // Q22002395 P50 has 2 values with "snaktype": "somevalue"
    // that should be removed
    _.all(simplified, (qid) => qid != null).should.equal(true)
    done()
  })

  it('should pass entity and property prefixes down', function (done) {
    const simplified = simplifyPropertyClaims(Q2112.claims.P190, 'wd')
    simplified[0].should.equal('wd:Q207614')
    const simplified2 = simplifyPropertyClaims(Q2112.claims.P123456789, null, 'wdt')
    simplified2[0].should.equal('wdt:P207614')
    done()
  })
})

describe('simplifyClaim', function () {
  it('should return a valid time for possible invalid dates', function (done) {
    // exemple: Q4132785>P577 is 1953-00-00T00:00:00Z
    const simplified = simplifyClaim(Q4132785.claims.P577[0])
    isNaN(simplified).should.equal(false)
    simplified.should.equal(-536457600000)
    done()
  })

  it('should return a valid time even for possible invalid negative date', function (done) {
    const simplified = simplifyClaim(Q4132785NegativeDate.claims.P577[0])
    isNaN(simplified).should.equal(false)
    simplified.should.equal(-123797894400000)
    done()
  })

  it('should return a url for datatype url', function (done) {
    const simplified = simplifyClaim(Q328212.claims.P856[0])
    simplified.should.equal('http://veronicarothbooks.blogspot.com')
    done()
  })

  it('should return simplify globecoordinate as a latLng array', function (done) {
    const simplified = simplifyClaim(Q2112.claims.P625[0])
    simplified.should.be.an.Array()
    simplified[0].should.equal(52.016666666667)
    simplified[1].should.equal(8.5166666666667)
    done()
  })

  it('should return prefixed entity ids if passed an entity prefix', function (done) {
    const simplified = simplifyClaim(Q2112.claims.P190[0])
    simplified.should.equal('Q207614')
    const simplified2 = simplifyClaim(Q2112.claims.P190[0], 'wd')
    simplified2.should.equal('wd:Q207614')
    const simplified3 = simplifyClaim(Q2112.claims.P190[0], 'wd:')
    simplified3.should.equal('wd::Q207614')
    const simplified4 = simplifyClaim(Q2112.claims.P190[0], 'wdbla')
    simplified4.should.equal('wdbla:Q207614')
    done()
  })

  it('should return prefixed property ids if passed a property prefix', function (done) {
    const simplified = simplifyClaim(Q2112.claims.P123456789[0])
    simplified.should.equal('P207614')
    const simplified2 = simplifyClaim(Q2112.claims.P123456789[0], null)
    simplified2.should.equal('P207614')
    const simplified3 = simplifyClaim(Q2112.claims.P123456789[0], null, 'wdt')
    simplified3.should.equal('wdt:P207614')
    const simplified4 = simplifyClaim(Q2112.claims.P123456789[0], null, 'wdt:')
    simplified4.should.equal('wdt::P207614')
    const simplified5 = simplifyClaim(Q2112.claims.P123456789[0], null, 'wdtbla')
    simplified5.should.equal('wdtbla:P207614')
    done()
  })
})