const express = require("express");
const router = express.Router();

const postController = require("../controllers/post.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const postModel = require("../models/post.model");

router.post('/create-post',authMiddleware,postController.createPost);
router.get('/delete/:id',authMiddleware,postController.deletePost);

router.get('/edit/:id',async (req,res) => {
    const post = await postModel.findById({_id:req.params.id});
    res.render("edit",{post});
})

router.post('/edit/:id',authMiddleware,postController.editPost)

router.get("/like/:id", authMiddleware, postController.likePost);

module.exports = router;