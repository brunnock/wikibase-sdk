#!/usr/bin/env ts-node
import { kebabCase } from 'lodash-es'
import { red, green } from 'tiny-chalk'
import { parsers } from '../src/helpers/parse_claim.js'
import { readJsonFile } from '../tests/lib/utils.js'

const supportedTypes = Object.keys(parsers)

const allDatatypes = readJsonFile('/tmp/all_wikidata_datatypes.json') as string[]
allDatatypes
.map(typeUri => {
  const typeName = typeUri.split('#')[1]
  // Case inconsistency: commonsMedia is camel cased
  if (typeName === 'CommonsMedia') return 'commonsMedia'
  return kebabCase(typeName)
})
.forEach(type => {
  if (supportedTypes.includes(type)) {
    console.log(green('ok'), type)
  } else {
    console.error(red('unsupported type'), type)
  }
})
