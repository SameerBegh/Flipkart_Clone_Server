import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import Connection from "./DataBase/db.js";   
import DefaultItem from "./DefaultItem.js";
import router from "./Routes/Route.js";

const PORT = process.env.PORT || 8000;

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const URL = process.env.MONGODB_URI || `mongodb+srv://${username}:${password}@ecommerce.ho9okqd.mongodb.net/?retryWrites=true&w=majority`;

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json())
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", router);

Connection(URL);

app.listen(PORT, () => {
  console.log(`Server is connected on PORT ${PORT}`);
});
 
// After server Connection
DefaultItem();

export let paymentMerchantKey = process.env.PAYTM_MERCHANT_KEY;


