import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'
const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('any_field')
}
describe('RequiredField validation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ name: 'any_name' })

    expect(error).toEqual(new MissingParamError('any_field'))
  })

  test('should not return if validation success', () => {
    const sut = makeSut()
    const error = sut.validate({ any_field: 'any_name' })

    expect(error).toBeFalsy()
  })
})
