import { type EmailValdiator } from '../protocols/email-validator'

export const mockEmailValidator = (): EmailValdiator => {
  class EmailValidatorStub implements EmailValdiator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}
