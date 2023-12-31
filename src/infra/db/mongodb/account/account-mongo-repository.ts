import { ObjectId } from 'mongodb'
import { type AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { type LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { type UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'
import { type AccountModel } from '@/domain/models/account'
import { type AddAccountParams } from '@/domain/usecases/account/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
import { type LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
  async add (accountData: AddAccountParams): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    return MongoHelper.map(result, accountData)
  }

  async loadByEmail (email: string): Promise<AccountModel | null> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    if (account) {
      return {
        id: account._id.toString(),
        name: account.name,
        email: account.email,
        password: account.password
      }
    }
    return null
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({
      _id: new ObjectId(id)
    }, {
      $set: {
        accessToken: token
      }
    })
  }

  async loadByToken (token: string, role?: string | undefined): Promise<AccountModel | null> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [
        {
          role
        }, {
          role: 'admin'
        }
      ]
    })
    if (account) {
      return {
        id: account._id.toString(),
        name: account.name,
        email: account.email,
        password: account.password
      }
    }
    return null
  }
}
