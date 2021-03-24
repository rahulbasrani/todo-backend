import config from "config";
import { MongoMemoryServer } from "mongodb-memory-server";
<<<<<<< Updated upstream
import { connect, Mongoose as M } from "mongoose";
=======
import { connect, Mongoose as M, MongooseDocument } from "mongoose";
>>>>>>> Stashed changes
import { Mongoose } from "@storage";

export class InMemoryMongoStore extends Mongoose.MongoStore {
  constructor() {
    super();
  }

  public async connect(): Promise<M> {
    const mongod = new MongoMemoryServer();
<<<<<<< Updated upstream
    const uri: string = await mongod.getUri();
=======
    const uri = await mongod.getUri();
>>>>>>> Stashed changes
    const options = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    };
    return connect(uri, options);
  }
}
