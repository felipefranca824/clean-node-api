import { type Collection, MongoClient, type InsertOneResult } from 'mongodb'

export const MongoHelper = {
  client: MongoClient,
  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(global.__MONGO_URI__)
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
  }
}
