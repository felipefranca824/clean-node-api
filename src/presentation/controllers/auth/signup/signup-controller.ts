import { EmailInUseError } from '../../../errors'
import { badRequest, serverError, ok, forbidden } from '../../../helpers/http/http-helper'
import { type HttpRequest, type Controller, type HttpResponse } from '../../../protocols'
import { type Authentication } from '../login/login-controller-protocols'
import { type Validation, type AddAccount } from './signup-controller-protocols'

export class SignUpController implements Controller {
  constructor (private readonly addAccount: AddAccount, private readonly validation: Validation, private readonly authentication: Authentication) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.add({ name, email, password })
      if (!account) {
        return forbidden(new EmailInUseError())
      }
      const accessToken = await this.authentication.auth({ email, password })
      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
