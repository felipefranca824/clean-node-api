import { type Collection, MongoClient, type InsertOneResult } from 'mongodb'

export const MongoHelper = {
  client: MongoClient,
  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
  },

  async disconnect () {
    await this.client.close()
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },

  map: (collection: InsertOneResult<Document>, model: any): any => {
    const id = collection.insertedId.toString()
    return Object.assign({}, model, { id })
  },

  mapCollection: (collection: any[]): any[] => {
    return collection.map(c => MongoHelper.mapOne(c))
  },

  mapOne: (data: any): any => {
    const { _id, ...colecctionWithoutId } = data
    return Object.assign({}, colecctionWithoutId, { id: _id })
  }
}
