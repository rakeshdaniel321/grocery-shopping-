import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import connectDb from './config/mongodb.js';

const app = express();
const port =process.env.PORT || 5000;

//db connection
await connectDb();

//muliple origins
const allowedOrigins = ['http://localhost:5000',];
//middleware
app.use(cors({origin: allowedOrigins,credentials: true}));
app.use(cookieParser());
app.use(express.json());

//routes
app.get('/', (req, res) => { res.send('Grocery Backend Server is running')});



app.listen(port, () => {
  console.log(`Server is running on port http://localhost:5000 : ${port}`);
});