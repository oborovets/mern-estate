import express from "express";

import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} from "../controller/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.post("/update/:id", verifyToken, updateListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.get("/get", getListings);
router.get("/:id", getListing);

export default router;
