import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { LoadSurveysController } from './load-surveys-controller'
import { type LoadSurveys } from './load-surveys-controller-protocols'
import MockDate from 'mockdate'
import { mockSurveyModels, throwError } from '@/domain/test'
import { mockLoadSurveys } from '@/presentation/test'

type SutTypes = {
  sut: LoadSurveysController
  loadSurveyStub: LoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveyStub = mockLoadSurveys()

  const sut = new LoadSurveysController(loadSurveyStub)

  return {
    sut, loadSurveyStub
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveys', async () => {
    const { sut, loadSurveyStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyStub, 'load')

    await sut.handle({})

    expect(loadSpy).toHaveBeenCalled()
  })

  test('should return 200 on success', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(ok(mockSurveyModels()))
  })

  test('should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveyStub } = makeSut()
    jest.spyOn(loadSurveyStub, 'load').mockImplementationOnce(throwError)

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveyStub } = makeSut()
    jest.spyOn(loadSurveyStub, 'load').mockReturnValueOnce(Promise.resolve([]))
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(noContent())
  })
})
