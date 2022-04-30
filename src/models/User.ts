import dynamoose from 'dynamoose';
import { Document } from 'dynamoose/dist/Document';

export class User extends Document {
  id: string;
  name: string;
  last_name: string;
  email: string;
  password: string;
  balance: number;
  create_date: string;
  update_date: string;
}

export const UserModel = dynamoose.model<User>(
  process.env.USER as string ? process.env.USER as string : "users",
  new dynamoose.Schema(
    {
      id: { "type": String, "hashKey": true },
      name: String,
      last_name: String,
      email: String,
      password: String,
      balance: Number,
      create_date: String,
      update_date: String,
    },
    {
      saveUnknown: true,
      timestamps: false,
    },
  ),
  {
    create: false,
    waitForActive: { enabled: false },
  },
);
