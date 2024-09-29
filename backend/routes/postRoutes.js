import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import {
    createPost, getPost, deletePost, likeUnlike, replyToPost, getFeedPost,getUserPosts,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeedPost);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);
router.post("/create", protectRoute, createPost); 
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likeUnlike);
router.put("/reply/:id", protectRoute, replyToPost);

export default router;
