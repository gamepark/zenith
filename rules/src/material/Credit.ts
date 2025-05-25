import { getEnumValues } from '@gamepark/rules-api'

export enum Credit {
  Credit1 = 1,
  Credit3 = 3,
  Credit5 = 5
}

export const credits = getEnumValues(Credit)
