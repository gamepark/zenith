import { TokenDescription } from '@gamepark/react-game'
import { Credit } from '@gamepark/zenith/material/Credit'
import Credit1 from '../images/credit/Credit1.png'
import Credit3 from '../images/credit/Credit3.png'
import Credit5 from '../images/credit/Credit5.png'

class CreditTokenDescription extends TokenDescription {
  images = {
    [Credit.Credit1]: Credit1,
    [Credit.Credit3]: Credit3,
    [Credit.Credit5]: Credit5
  }

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
}

export const creditTokenDescription = new CreditTokenDescription()
