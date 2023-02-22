import mongoose from "mongoose";

export const Connection = async (URL) => {
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("DataBase connected Successfully");
  } catch (error) {
    console.log("Error", error);
  }
};

export default Connection;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                