import User from "../models/userModels.js";
import Post from "../models/postModel.js";
import { v2 as cloudinary} from "cloudinary";

const createPost = async (req, res) => {
    try {
        const { postedBy, text } = req.body;
        let { img } = req.body;

        console.log("Received data:", req.body);

        if (!postedBy || !text) {
            console.error("Missing postedBy or text");
            return res.status(400).json({ message: "postedBy and text are required" });
        }

        const user = await User.findById(postedBy);
        if (!user) {
            console.error("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        if (!req.user || user._id.toString() !== req.user._id.toString()) {
            console.error("Unauthorized user");
            return res.status(401).json({ message: "Unauthorized to create post" });
        }

        if (text.length > 500) {
            console.error("Text too long");
            return res.status(400).json({ message: "Text must be less than 500 characters" });
        }

        if (img) {
            try {
                const uploadedResponse = await cloudinary.uploader.upload(img);
                img = uploadedResponse.secure_url;
            } catch (uploadError) {
                console.error("Image upload failed:", uploadError);
                return res.status(500).json({ message: "Image upload failed", error: uploadError.message });
            }
        }

        const newPost = new Post({ postedBy, text, img });
        await newPost.save();
        res.status(201).json( newPost);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



const getPost = async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(404).json({message:"Post not found"})
        }

        res.status(500).json(post)
        
    } catch (error) {
        req.status(500).json({error:error.message});
    }
};

const deletePost = async (req, res) => {
    try {
      // Find the post by ID
      const post = await Post.findById(req.params.id);
      
      // Check if post exists
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      // Check if the user is authorized to delete the post
      if (post.postedBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Unauthorized to delete post" });
      }
  
      // If post has an image, delete it from Cloudinary
      if (post.img) {
        const imgId = post.img.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(imgId);
      }
  
      // Delete the post from the database
      await Post.findByIdAndDelete(req.params.id);
  
      // Send a success response
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      // Handle any errors and send error response
      res.status(500).json({ message: error.message });
    }
  };
  

const likeUnlike = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const userLikedPost = post.likes.includes(userId);
        if (userLikedPost) {
            // Unlike Post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            res.status(200).json({ message: "Post UNliked successfully" });

        } else {
            // Like Post
            post.likes.push(userId);
            await post.save();
            res.status(200).json({ message: "Post liked successfully" });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const replyToPost = async (req,res) => {
    try {
        const postId = req.params.id;
        const {text} = req.body;
        const userId = req.user._id;
        const userProfilePic = req.user.userProfilePic;
        const username = req.user.username;

        if(!text){
            return res.status(400).json({message:"text field is required"})
        }

        const post  = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message:"Post not found"})
        }

        const reply = {userId,text,userProfilePic,username};
        post.replies.push(reply);
        await post.save();

        res.status(200).json({message:"Reply added successfully",post})
        
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

const getFeedPost = async (req,res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user){
            return res.this.setState(404).json({message:"USer not found"});

        }

        const following = user.following;

        const feedPost = await Post.find({postedBy:{$in:following}}).sort({createdAt:-1});
        res.status(200).json(feedPost);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};


const getUserPosts = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};


export { createPost ,getPost , deletePost ,likeUnlike,replyToPost , getFeedPost,getUserPosts};
