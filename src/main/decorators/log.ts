import { type LogErrorRepository } from '../../data/protocols/log-error-repository'
import { type HttpResponse, type Controller, type HttpRequest } from '../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  constructor (private readonly controller: Controller, private readonly logErrorRepositoryStub: LogErrorRepository) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepositoryStub.logError(httpResponse.body.stack)
    }
    return httpResponse
  }
}
