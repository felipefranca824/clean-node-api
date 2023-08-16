import { type LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { type AddSurveyModel, type AddSurveyRepository } from '@/data/usecases/add-survey/db-add-survey-protocols'
import { type SurveyModel } from '@/domain/models/survey'
import { MongoHelper } from '../helpers/mongo-helper'
import { type LoadSurveyByIdRepository } from '@/data/usecases/load-survey-by-id/db-load-survey-by-id-protocols'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()

    return surveys.map<SurveyModel>((value) => {
      return {
        id: value._id.toString(),
        question: value.question,
        date: value.date,
        answers: value.answers
      }
    })
  }

  async loadById (id: string): Promise<SurveyModel | null> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })
    if (survey) {
      return {
        id: survey._id.toString(),
        question: survey.question,
        answers: survey.answers,
        date: survey.date
      }
    }
    return null
  }
}
