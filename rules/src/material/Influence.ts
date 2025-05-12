import { getEnumValues } from '@gamepark/rules-api'

export enum Influence {
  Mercury = 1,
  Venus,
  Terra,
  Mars,
  Jupiter
}

export const influences = getEnumValues(Influence)
