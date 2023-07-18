import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'
const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldCompare')
}
describe('CompareFields validation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_value', fieldCompare: 'wrong_value' })

    expect(error).toEqual(new InvalidParamError('fieldCompare'))
  })

  test('should not return if validation success', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_value', fieldCompare: 'any_value' })

    expect(error).toBeFalsy()
  })
})
