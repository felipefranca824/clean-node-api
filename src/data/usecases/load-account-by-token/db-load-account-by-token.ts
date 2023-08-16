import { type LoadAccountByToken, type Decrypter, type LoadAccountByTokenRepository, type AccountModel } from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {

  }

  async load (accessToken: string, role?: string | undefined): Promise<AccountModel | null | undefined> {
    const token = await this.decrypter.decrypt(accessToken)
    if (token) {
      return await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
    }

    return null
  }
}
