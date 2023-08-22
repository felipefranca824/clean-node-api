import { type Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { type SurveyModel } from '@/domain/models/survey'
import { type AccountModel } from '@/domain/models/account'
let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    surveyResultCollection = MongoHelper.getCollection('surveysResults')
    await surveyResultCollection.deleteMany({})

    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): SurveyResultMongoRepository => {
    return new SurveyResultMongoRepository()
  }

  const makeSurvey = async (): Promise<SurveyModel> => {
    const survey = {
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        },
        {
          answer: 'other_answer'
        }
      ],
      date: new Date()
    }
    const response = await surveyCollection.insertOne(survey)

    return Object.assign({}, survey, { id: response.insertedId.toString() })
  }

  const makeAccount = async (): Promise<AccountModel> => {
    const account = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'

    }
    const response = await accountCollection.insertOne(account)

    return Object.assign({}, account, { id: response.insertedId.toString() })
  }

  describe('save()', () => {
    test('should add a survey result if new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const sut = makeSut()

      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(survey.answers[0].answer)
    })

    test('should update survey result if its not new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()

      await surveyResultCollection.insertOne({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })

      const sut = makeSut()

      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.answer).toBe(survey.answers[1].answer)
      expect(surveyResult.surveyId).toBe(survey.id)
      expect(surveyResult.accountId).toBe(account.id)
    })
  })
})
