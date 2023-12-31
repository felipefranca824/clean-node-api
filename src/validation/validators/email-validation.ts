import { InvalidParamError } from '@/presentation/errors'
import { type EmailValdiator } from '../protocols/email-validator'
import { type Validation } from '@/presentation/protocols'

export class EmailValidation implements Validation {
  constructor (private readonly fieldName: string, private readonly emailValidator: EmailValdiator) {}
  validate (input: any): Error | null | undefined {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
