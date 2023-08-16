
import { SignUpController } from '@/presentation/controllers/auth/signup/signup-controller'
import { type Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbAddAccount } from '@/main/factories/usecases/account/add-account/db-add-account-factory'
import { makeDbAuthentication } from '@/main/factories/usecases/authentication/db-authentication-factory'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  return makeLogControllerDecorator(new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication()))
}
