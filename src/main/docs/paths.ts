import { signUpPath, surveyResultPath, surveyPath, loginPath } from './paths/'

export default {
  '/login': loginPath,
  '/surveys': surveyPath,
  '/signup': signUpPath,
  '/surveys/{surveyId}/results': surveyResultPath
}
