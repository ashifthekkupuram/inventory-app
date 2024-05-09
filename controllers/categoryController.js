import AsyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

import Category from "../models/category.js";
import Item from "../models/item.js";

export const category_items_get = AsyncHandler(async (req, res, next) => {
  const [categories, category, categorizedItems] = await Promise.all([
    Category.find({}).exec(),
    Category.findById(req.params.id).exec(),
    Item.find({category: req.params.id}).populate('category').exec()
  ])

  if(category === null){
    const err = new Error('Category not found!')
    err.status = 404
    return next(err)
  }

  res.render('item_list', {
    title: `${category.name} Items: `,
    categories,
    items: categorizedItems,
    category,
  })

});

export const category_create_get = AsyncHandler(async (req, res, next) => {
  const categories = await Category.find({}).exec()
  res.render("category_form",{
    title: "Create Category: ",
    categories,
  });
});

export const category_create_post = [
  body('name', 'The category name should consist of a minimum of three characters and a maximum of 150 characters in length.')
    .trim()
    .isLength({min:3,max:150})
    .escape(),
  body('description')
    .optional({values: 'falsy'})
    .escape(),
  AsyncHandler(async (req, res, next) => {

    const categories = await Category.find({}).exec()

    const errors = validationResult(req)
    
    const category = new Category({
      name: req.body.name,
      description: req.body.description
    })

    if(!errors.isEmpty()){
      res.render('category_form',{
        category,
        categories,
        title: "Create Category: ",
        errors: errors.array()
      })
      return;
    }else{
      const categoryExist = await Category.findOne({name: req.body.name})
      .collation({locale: 'en', strength: 2})
      .exec()
      if(categoryExist){
        res.redirect(categoryExist.url)
      }else{
        await category.save()
        res.redirect('/')
      }
    }
  })
]

export const category_delete_get = AsyncHandler(async (req, res, next) => {
  const [categories, category, categorized_items] = await Promise.all([
    Category.find({}).exec(),
    Category.findById(req.params.id),
    Item.find({category: req.params.id}).exec()
  ])

  if(category === null){
    const err = new Error('Category not found')
    err.status = 404
    return next(err)
  }

  res.render('category_delete',{
    categories,
    category,
    categorized_items,
    title: `Delete Category: ${category.name}`
  })

});

export const category_delete_post = AsyncHandler(async (req, res, next) => {
  await Category.findByIdAndDelete(req.body.id)
  res.redirect('/')
});

export const category_update_get = AsyncHandler(async (req, res, next) => {
  const [categories, category] = await Promise.all([
    Category.find({}).exec(),
    Category.findById(req.params.id).exec()
  ])

  if(category === null){
    const err = new Error('Category not found')
    err.status = 404
    return next(err)
  }

  res.render('category_form',{
    categories,
    category,
    title: `Update Category: `
  })
});

export const category_update_post = [
  body('name', 'The category name should consist of a minimum of three characters and a maximum of 150 characters in length.')
    .trim()
    .isLength({min:3,max:150})
    .escape(),
  body('description')
    .optional({values: 'falsy'})
    .escape(),
  AsyncHandler(async (req, res, next) => {

    const categories = await Category.find({}).exec()

    const errors = validationResult(req)

    const category =  new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id
    })

    if(!errors.isEmpty()){
      res.render('category_form', {
        title: 'Update Category:',
        categories,
        category,
        errors: errors.array()
      })
      return;
    }else{
      const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category,{})
      res.redirect(updatedCategory.url)
    }
})
]
