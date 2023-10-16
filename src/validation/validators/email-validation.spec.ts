import { InvalidParamError } from '@/presentation/errors'
import { type EmailValdiator } from '../protocols/email-validator'
import { EmailValidation } from './email-validation'
import { mockEmailValidator } from '../test'

type SutTypes = {
  sut: EmailValidation
  emailValidatorStub: EmailValdiator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = mockEmailValidator()

  const sut = new EmailValidation('email', emailValidatorStub)

  return {
    sut, emailValidatorStub
  }
}

describe('Email validation', () => {
  test('should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const error = sut.validate({ email: 'any_email@mail.com' })
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('should call EmailValidor with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    sut.validate({ email: 'any_email@mail.com' })
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
})
