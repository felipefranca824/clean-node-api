import { type LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { type AddSurveyModel, type AddSurveyRepository } from '@/data/usecases/add-survey/db-add-survey-protocols'
import { type SurveyModel } from '@/domain/models/survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
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
}
