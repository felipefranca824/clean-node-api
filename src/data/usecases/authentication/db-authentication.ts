import { type Authentication, type AuthenticationModel } from '../../../domain/usecases/authentication'
import { type HashComparer } from '../../protocols/criptography/hash-comparer'
import { type TokenGenerator } from '../../protocols/criptography/token-generator'
import { type LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { type UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hasComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      const isValid = await this.hasComparer.compare(authentication.password, account.password)
      if (isValid) {
        const acccesToken = await this.tokenGenerator.generate(account.id)
        await this.updateAccessTokenRepositoryStub.update(account.id, acccesToken)
        return acccesToken
      }
    }
    return null
  }
}
