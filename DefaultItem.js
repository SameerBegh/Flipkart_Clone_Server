import{products} from "./Items/Items.js";
import Product from './module/Schema.js';

const DefaultItem = async() => {
  try{
    // await Product.deleteMany({});
    await Product.insertMany(products);
  
  // console.log("deleted Items successfully")
    console.log("Inserted Items successfully")
  }catch(error){
    console.log('Error while inserting default items', error.message);
  }
}

export default DefaultItem;

