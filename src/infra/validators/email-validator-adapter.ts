import validator from 'validator'
import { type EmailValdiator } from '@/validation/protocols/email-validator'
export class EmailValidatorAdapter implements EmailValdiator {
  isValid (email: string): boolean {
    return validator.isEmail(email)
  }
}
