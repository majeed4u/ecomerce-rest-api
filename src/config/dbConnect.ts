import mongoose from 'mongoose';
import env from '../utils/enValidator';

const dbConnect = async () => {
  try {
    const connected = await mongoose.connect(env.MONGO_URL);
    console.log(`mongodb connected ${connected.connection.host}`);
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default dbConnect;
