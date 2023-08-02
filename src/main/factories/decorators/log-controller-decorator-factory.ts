import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { type Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'

export const makeLogControllerDecorator = (conrtoller: Controller): Controller => {
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(conrtoller, logMongoRepository)
}
