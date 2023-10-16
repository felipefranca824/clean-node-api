import {
  type UpdateAccessTokenRepository,
  type LoadAccountByEmailRepository,
  type Encrypter,
  type HashComparer,
  type AuthenticationParams,
  type Authentication
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hasComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
  ) {}

  async auth (authentication: AuthenticationParams): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
    if (account) {
      const isValid = await this.hasComparer.compare(authentication.password, account.password)
      if (isValid) {
        const acccesToken = await this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepositoryStub.updateAccessToken(account.id, acccesToken)
        return acccesToken
      }
    }
    return null
  }
}
