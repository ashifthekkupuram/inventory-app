import express from "express";
import {
  category_items_get,
  category_create_get,
  category_create_post,
  category_delete_get,
  category_delete_post,
  category_update_get,
  category_update_post,
} from "../controllers/categoryController.js";

const router = express.Router();

// Create Category
router.get("/create", category_create_get);
router.post("/create", category_create_post);

// List all Categories
router.get("/:id", category_items_get);

// Update Catogory
router.get("/:id/update", category_update_get);
router.post("/:id/update", category_update_post);

// Delete Category
router.get("/:id/delete", category_delete_get);
router.post("/:id/delete", category_delete_post);

export default router;
