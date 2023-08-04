import { MissingParamError } from '../../presentation/errors'
import { type Validation } from '../../presentation/protocols'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldname: string) {}
  validate (input: any): Error | null | undefined {
    if (!input[this.fieldname]) {
      return new MissingParamError(this.fieldname)
    }
  }
}
