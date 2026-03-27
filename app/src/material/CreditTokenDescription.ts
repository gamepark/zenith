import { TokenDescription } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
import { Credit } from '@gamepark/zenith/material/Credit'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import Credit1 from '../images/credit/Credit1.png'
import Credit3 from '../images/credit/Credit3.png'
import Credit5 from '../images/credit/Credit5.png'
import { CreditTokenHelp } from './CreditTokenHelp'

class CreditTokenDescription extends TokenDescription {
  help = CreditTokenHelp
  images = {
    [Credit.Credit1]: Credit1,
    [Credit.Credit3]: Credit3,
    [Credit.Credit5]: Credit5
  }

  transparency = true

  getSize(itemId: Credit) {
    switch (itemId) {
      case Credit.Credit1:
        return { width: 1.5, height: 1.5 }
      case Credit.Credit3:
        return { width: 2, height: 2 }
      case Credit.Credit5:
        return { width: 2.5, height: 2.5 }
    }
  }

  stockLocation = { type: LocationType.CreditStock }
  staticItems = [
    { id: Credit.Credit1, quantity: 10, location: { ...this.stockLocation, id: Credit.Credit1 } },
    { id: Credit.Credit3, quantity: 10, location: { ...this.stockLocation, id: Credit.Credit3 } },
    { id: Credit.Credit5, quantity: 10, location: { ...this.stockLocation, id: Credit.Credit5 } }
  ]

  getStockLocation(item: MaterialItem) {
    switch (item.id) {
      case Credit.Credit1:
        return credit1StockLocation
      case Credit.Credit3:
        return credit3StockLocation
      default:
      case Credit.Credit5:
        return credit5StockLocation
    }
  }
}

export const credit1StockLocation = { type: LocationType.CreditStock, id: Credit.Credit1 }
export const credit3StockLocation = { type: LocationType.CreditStock, id: Credit.Credit3 }
export const credit5StockLocation = { type: LocationType.CreditStock, id: Credit.Credit5 }

export const creditTokenDescription = new CreditTokenDescription()
