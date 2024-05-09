import express from "express";
import {
  item_list_get,
  item_detail_get,
  item_create_get,
  item_create_post,
  item_delete_get,
  item_delete_post,
  item_update_get,
  item_update_post,
} from "../controllers/itemController.js";

const router = express.Router();

// List all Items
router.get("/", item_list_get);

// Create Item
router.get("/create", item_create_get);
router.post("/create", item_create_post);

// Display Item
router.get('/:id',item_detail_get);

// Update Item
router.get("/:id/update", item_update_get);
router.post("/:id/update", item_update_post);

// Delete Item
router.get("/:id/delete", item_delete_get);
router.post("/:id/delete", item_delete_post);

export default router;
