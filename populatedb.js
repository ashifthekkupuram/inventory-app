#! /usr/bin/env node

console.log(
    'This script populates categories and items to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  // const userArgs = process.argv.slice(2);
  import dotenv from 'dotenv'
  dotenv.config()
  
  import Category from "./models/category.js"
  import Item from "./models/item.js"

  
  const categories = [];
  const items = [];
  
  import mongoose from "mongoose";
  mongoose.set("strictQuery", false);
  
  const mongoDB = process.env.MONGODB_CLUSTER_URI
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createItem();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // genre[0] will always be the Fantasy genre, regardless of the order
  // in which the elements of promise.all's argument complete.
  async function categoryCreate(index, name, description) {
    const category = new Category({ name: name, description, });
    await category.save();
    categories[index] = category;
    console.log(`Added category: ${name}`);
  }
  
  async function itemCreate(index, name, description, category, price) {
    const itemdetail = { name, description, category, price };
  
    const item = new Item(itemdetail);
  
    await item.save();
    items[index] = item;
    console.log(`Added item: ${name}`);
  }
  
  
  async function createCategories() {
    console.log("Adding genres");
    await Promise.all([
        categoryCreate(0, "Vegetables","vegetable, in the broadest sense, any kind of plant life or plant product, namely “vegetable matter”"),
        categoryCreate(1, "Fruits", "a fruit is the fleshy or dry ripened ovary of a flowering plant, enclosing the seed or seeds"),
    ]);
  }
  
  async function createItem() {
    console.log("Adding authors");
    await Promise.all([
      itemCreate(0, 'Tomato', "is a tomato", categories[0], 32),
      itemCreate(1, "Apple", "is an apple", categories[1], 67),
      itemCreate(2, "Mango", "is an Mango", categories[1], 107),
      itemCreate(3, "Onion", "is an apple", categories[0], 28),
    ]);
  }
  
 