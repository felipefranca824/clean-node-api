
import { LoginController } from '@/presentation/controllers/auth/login/login-controller'
import { type Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbAuthentication } from '@/main/factories/usecases/authentication/db-authentication-factory'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  return makeLogControllerDecorator(new LoginController(makeLoginValidation(), makeDbAuthentication()))
}
