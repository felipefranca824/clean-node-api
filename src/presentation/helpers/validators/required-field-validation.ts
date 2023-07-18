import { MissingParamError } from '../../errors'
import { type Validation } from '../../protocols/validation'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldname: string) {}
  validate (input: any): Error | null | undefined {
    if (!input[this.fieldname]) {
      return new MissingParamError(this.fieldname)
    }
  }
}
