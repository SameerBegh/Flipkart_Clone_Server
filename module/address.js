import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  user_id: {
    type: String,
    require: true,
  },

  addAddress: [
    {
      Name :String,
      Mobile:Number,
      Pincode:Number,
      Landmark:String,
      City:String,
      Address:String,
      AddressType:String,
      Locality:String,    
      State:String,
      Phone:Number,
    },
  ],
});

const AddAddress = mongoose.model("addressCollection", addressSchema);

export default AddAddress;
