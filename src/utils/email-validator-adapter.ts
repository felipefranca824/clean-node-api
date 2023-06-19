import { type EmailValdiator } from '../presentation/protocols/email-validator'
import validator from 'validator'
export class EmailValidatorAdapter implements EmailValdiator {
  isValid (email: string): boolean {
    return validator.isEmail(email)
  }
}
