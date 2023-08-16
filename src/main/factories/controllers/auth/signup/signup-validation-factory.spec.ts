
import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { type EmailValdiator } from '@/validation/protocols/email-validator'
import { type Validation } from '@/presentation/protocols/validation'
import { makeSignUpValidation } from './signup-validation-factory'

jest.mock('../../../../../validation/validators/validation-composite')

const makeEmailValidator = (): EmailValdiator => {
  class EmailValidatorStub implements EmailValdiator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
