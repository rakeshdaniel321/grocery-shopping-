import mongoose, { connection } from 'mongoose';

const connectDb =async () =>{
    try{
     mongoose.connection.on ('connected', () => {
        console.log('MongoDB connected successfully');
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/grocery`);

}
catch (error){
    console.error(error.message);
}
}

export default connectDb;