import dynamoose from 'dynamoose';
import { Document } from 'dynamoose/dist/Document';

export class Roulette extends Document {
  id!: string;
  name: string;
  numbers_to_bet: any;
  colors_to_bet: any;
  maximum_money: number;
  winning_numerical_result: number;
  winning_color_result: string;
  bets: any;
  status_roulette: string;
  closing_date: string;
  create_date: string;
  update_date: string;
}

export const RouletteModel = dynamoose.model<Roulette>(
  process.env.ROLETTE as string ? process.env.ROLETTE as string : "rolettes",
  new dynamoose.Schema(
    {
      id: { "type": String, "hashKey": true },
      name: String,
      numbers_to_bet: Array,
      colors_to_bet: Array,
      maximum_money: Number,
      winning_numerical_result: Number,
      winning_color_result: String,
      bets: Array,
      status_roulette: String,
      closing_date: String,
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
