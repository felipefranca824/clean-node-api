import { SignUpController } from './signup-controller'
import { EmailInUseError, MissingParamError, ServerError } from '@/presentation/errors'
import { type AddAccount, type HttpRequest, type Validation } from './signup-controller-protocols'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { type Authentication } from '../login/login-controller-protocols'
import { mockAddAccount, mockAuthentication, mockValidation } from '@/presentation/test'

const mockRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

type SutTypes = {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const addAccountStub = mockAddAccount()
  const validationStub = mockValidation()
  const authenticationStub = mockAuthentication()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)

  return {
    sut, addAccountStub, validationStub, authenticationStub
  }
}

describe('SignUpController', () => {
  test('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await Promise.reject(new Error())
    })

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    await sut.handle(mockRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  test('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()

    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(mockRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_email@mail.com', password: 'any_password' })
  })

  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })
})
