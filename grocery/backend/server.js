import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import connectDb from './config/mongodb.js';
import authRoutes from './routes/authRoutes.js';


const app = express();
const port =process.env.PORT || 7000;

//db connection
await connectDb();

//muliple origins
const allowedOrigins = ['http://localhost:3000',];
//middleware
app.use(cors({origin: allowedOrigins,credentials: true}));
app.use(cookieParser());
app.use(express.json());

//routes
app.get('/', (req, res) => { res.send('Grocery backend Server is running ')});


//auth routes user registration  /api/auth/register

app.use('/api/auth', authRoutes);




app.listen(port, () => {
  console.log(`Server is running on port http://localhost: ${port}`);
});