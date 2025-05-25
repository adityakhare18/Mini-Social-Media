const express = require('express')
const postModel = require('../models/post.model');
const userModel = require('../models/user.model');

const router = express.Router();


const createPost = async (req,res) => {
    const { postData } = req.body;
    let user = await userModel.findOne({email:req.user.email});
    const post = await postModel.create({
        user : user._id,
        postData,
    })
    user.posts.push(post._id);
    await user.save();
    res.redirect('/profile')
}


const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id; // assuming you have user info from auth middleware

    // 1. Delete the post itself
    await postModel.findByIdAndDelete(postId);

    // 2. Remove the post ID from user's posts array
    await userModel.findByIdAndUpdate(userId, {
      $pull: { posts: postId }
    });

    // 3. Redirect after deletion
    res.redirect('/profile');
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).send('Server error');
  }
};


const editPost = async (req, res) => {
  try {
    await postModel.findByIdAndUpdate(
      req.params.id,
      { postData: req.body.postData },
      { new: true }
    );
    res.redirect('/profile');
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).send("Something went wrong.");
  }
};

const likePost = async (req, res) => {
  let post = await postModel.findOne({_id:req.params.id}).populate("user");

  if(post.likes.indexOf(req.user.id) === -1){
    post.likes.push(req.user.id);
  }
  else{
    post.likes.splice(post.likes.indexOf(req.user.id),1);
  }

  await post.save();

  res.redirect('/profile')
};



module.exports = {createPost,deletePost,editPost,likePost };