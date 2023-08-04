import { InvalidParamError } from '../../presentation/errors'
import { type Validation } from '../../presentation/protocols'

export class CompareFieldsValidation implements Validation {
  constructor (private readonly fieldName: string, private readonly fieldCompare: string) {}
  validate (input: any): Error | null | undefined {
    if (input[this.fieldName] !== input[this.fieldCompare]) {
      return new InvalidParamError(this.fieldCompare)
    }
  }
}
