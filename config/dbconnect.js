const mongoose =require("mongoose");

const connectDatabase = async () => {
    try {
      await mongoose.connect(process.env.DB_LOCAL_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  };
  
module.exports={connectDatabase}