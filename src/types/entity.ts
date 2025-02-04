import type { Claims, DataType } from './claim.js'
import type { Form, Sense, SimplifiedForms, SimplifiedSenses } from './lexeme.js'
import type { SimplifiedClaims } from './simplify_claims.js'
import type { SimplifiedSitelinks, Sitelinks } from './sitelinks.js'
import type { Aliases, Descriptions, Labels, Lemmas, SimplifiedAliases, SimplifiedDescriptions, SimplifiedLabels, SimplifiedLemmas } from './terms.js'

export const EntityTypes = [ 'item', 'property', 'lexeme', 'form', 'sense' ] as const
export type EntityType = typeof EntityTypes[number]

export type NumericId = `${number}`
export type ItemId = `Q${number}`
export type PropertyId = `P${number}`
export type LexemeId = `L${number}`
export type FormId = `L${number}-F${number}`
export type SenseId = `L${number}-S${number}`
export type EntitySchemaId = `E${number}`
export type MediaInfoId = `M${number}`
export type RevisionId = `${number}`

export type PropertyClaimsId = `${EntityId}#${PropertyId}`

export type EntityId = NonNestedEntityId | FormId | SenseId
export type NonNestedEntityId = ItemId | PropertyId | LexemeId | MediaInfoId
export type NamespacedEntityId = `Item:${ItemId}` | `Lexeme:${LexemeId}` | `Property:${PropertyId}`

export type Guid = `${EntityId|Lowercase<EntityId>}$${string}`
/**
 * A more shell-friendly GUID syntax, with a "-" instead of a "$"
 */
export type GuidAltSyntax = `${EntityId|Lowercase<EntityId>}-${string}`

export type Hash = string

export type Entity = (Property | Item | Lexeme)
export type EntityPageTitle = NamespacedEntityId | ItemId
export type Entities = Record<EntityId, Entity>

export interface Property extends EntityInfo {
  id: PropertyId,
  type: 'property'
  datatype?: DataType
  labels?: Labels
  descriptions?: Descriptions
  aliases?: Aliases
  claims?: Claims
}

export interface Item extends EntityInfo {
  id: ItemId,
  type: 'item'
  labels?: Labels
  descriptions?: Descriptions
  aliases?: Aliases
  claims?: Claims
  sitelinks?: Sitelinks
}

export interface Lexeme extends EntityInfo {
  id: LexemeId,
  type: 'lexeme'
  lexicalCategory: ItemId
  language: ItemId
  claims?: Claims
  lemmas?: Lemmas
  forms?: Form[]
  senses?: Sense[]
}

export interface EntityInfo {
  pageid?: number
  ns?: number
  title?: string
  lastrevid?: number
  modified?: string
  redirects?: { from: string, to: string }
}

export interface SimplifiedEntityInfo {
  id: EntityId
  modified?: string
}

export interface SimplifiedItem extends SimplifiedEntityInfo {
  type: 'item'
  labels?: SimplifiedLabels
  descriptions?: SimplifiedDescriptions
  aliases?: SimplifiedAliases
  claims?: SimplifiedClaims
  sitelinks?: SimplifiedSitelinks
  lexicalCategory: string
}

export interface SimplifiedProperty extends SimplifiedEntityInfo {
  type: 'property'
  datatype: DataType,
  labels?: SimplifiedLabels
  descriptions?: SimplifiedDescriptions
  aliases?: SimplifiedAliases
  claims?: SimplifiedClaims
  lexicalCategory: string
}

export interface SimplifiedLexeme extends SimplifiedEntityInfo {
  type: 'lexeme'
  lexicalCategory: ItemId
  language: ItemId
  claims?: SimplifiedClaims
  lemmas?: SimplifiedLemmas
  forms?: SimplifiedForms
  senses?: SimplifiedSenses
}

export type SimplifiedEntity = SimplifiedProperty | SimplifiedItem | SimplifiedLexeme
export type SimplifiedEntities = Record<EntityId, SimplifiedEntity>
