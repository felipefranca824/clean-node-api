
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { type LoadSurveyById, type Controller, type HttpRequest, type HttpResponse, type SaveSurveyResult } from './save-survey-result-controller-protocols'
import { AccessDeniedError, InvalidParamError } from '@/presentation/errors'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const { accountId } = httpRequest

      const survey = await this.loadSurveyById.loadById(surveyId)

      if (survey) {
        const answers = survey.answers.map(a => a.answer)

        if (answers.includes(answer)) {
          if (accountId != null) {
            const surveyResult = await this.saveSurveyResult.save({ surveyId, answer, accountId, date: new Date() })
            return ok(surveyResult)
          } else {
            return forbidden(new AccessDeniedError())
          }
        } else {
          return forbidden(new InvalidParamError('answer'))
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
