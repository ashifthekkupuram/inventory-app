import AsyncHandler from "express-async-handler";

import Item from "../models/item.js";
import Category from "../models/category.js";
import { body,validationResult } from "express-validator";

export const item_list_get = AsyncHandler(async (req, res, next) => {
  const [categories, items] = await Promise.all([
    Category.find({}).exec(),
    Item.find().populate('category').exec()
  ])

  
  res.render("item_list", {
    title: "Items :",
    items,
    categories,
  });
});

export const item_detail_get = AsyncHandler(async (req,res,next)=>{
  const [categories, item] = await Promise.all([
    Category.find({}).exec(),
    Item.findById(req.params.id).populate('category').exec()
  ])

  if(item === null){
    const err = new Error('Item not found!')
    err.status = 404
    next(err)
  }

  res.render('item_detail',{
    title: 'Item Detail: ',
    categories,
    item
  })
})

export const item_create_get = AsyncHandler(async (req, res, next) => {
  const categories = await Category.find({}).exec()

  res.render('item_form',{
    title: 'Create Item: ',
    categories,
  })
});

export const item_create_post = [

  (req,res,next) => {
    if(!Array.isArray(req.body.category)){
      typeof req.body.category === "undefined" ? [] : [req.body.category]
    }
    next()
  },

  body('name', 'The item name should consist of a minimum of three characters and a maximum of 150 characters in length.')
    .trim()
    .isLength({min:3,max:150})
    .escape(),
  body('description')
    .optional({values: 'falsy'})
    .escape(),
  body('price', 'A item must have a price.')
    .trim()
    .isNumeric()
    .withMessage('Only Decimals allowed')
    .escape(),
  body("category.*")
    .escape(),


  AsyncHandler(async (req, res, next)=>{

    const categories = await Category.find({}).exec()

    const errors = validationResult(req)

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
    })

    if(!errors.isEmpty()){

      for (const category of categories) {
        if (item.category.includes(category._id)) {
          category.checked = "true";
        }
      }

      res.render('item_form',{
        title: 'Create Item: ',
        categories,
        item,
        errors: errors.array()
      })
    }else{
      await item.save()
      res.redirect(item.url)
    }
  })
]

export const item_delete_get = AsyncHandler(async (req, res, next) => {
  const [categories, item] = await Promise.all([
    Category.find({}).exec(),
    Item.findById(req.params.id).populate('category').exec()
  ])

  if(item === null){
    const err = new Error('Item not found')
    err.status = 404
    return next(err)
  }

  res.render('item_delete',{
    categories,
    item,
    title: 'Delete Item: '
  })
});

export const item_delete_post = AsyncHandler(async (req, res, next) => {
  await Item.findByIdAndDelete(req.body.id)
  res.redirect('/')
});

export const item_update_get = AsyncHandler(async (req, res, next) => {
  const [categories, item] = await Promise.all([
    Category.find({}).exec(),
    Item.findById(req.params.id).exec()
  ])

  if(item === null){
    const err = new Error('Item not found!')
    err.status = 404
    return next(err)
  }

  categories.forEach((category) => {
    if (item.category.includes(category._id)) category.checked = "true";
  });

  res.render('item_form', {
    title: "Item Update: ",
    categories,
    item,
  })

});

export const item_update_post = [
  (req,res,next) => {
    if(!Array.isArray(req.body.category)){
      typeof req.body.category === "undefined" ? [] : [req.body.category]
    }
    next()
  },

  body('name', 'The item name should consist of a minimum of three characters and a maximum of 150 characters in length.')
    .trim()
    .isLength({min:3,max:150})
    .escape(),
  body('description')
    .optional({values: 'falsy'})
    .escape(),
  body('price', 'A item must have a price.')
    .trim()
    .isNumeric()
    .withMessage('Only Decimals allowed')
    .escape(),
  body("category.*")
    .escape(),

  AsyncHandler(async(req,res,next)=>{
    const categories = await Category.find({}).exec()

    const errors = validationResult(req)

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      _id: req.params.id,
    })

    if(!errors.isEmpty()){
      for (const category of categories) {
        if (item.category.includes(category._id)) {
          category.checked = "true";
        }
      }

      res.render('item_form', {
        title: 'Item Update: ',
        categories,
        item,
        errors: errors.array()
      })

    }else{
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {})
      res.redirect(updatedItem.url)
    }

  })
]
