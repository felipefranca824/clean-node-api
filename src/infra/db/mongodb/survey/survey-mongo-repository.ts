import { type LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { type AddSurveyParams, type AddSurveyRepository } from '@/data/usecases/survey/add-survey/db-add-survey-protocols'
import { type SurveyModel } from '@/domain/models/survey'
import { MongoHelper } from '../helpers/mongo-helper'
import { type LoadSurveyByIdRepository } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()

    return MongoHelper.mapCollection(surveys)
  }

  async loadById (id: string): Promise<SurveyModel | null> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })

    return survey && MongoHelper.mapOne(survey)
  }
}
