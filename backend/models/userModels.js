import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            minLength: 6,
            required: true,
        },
        profilePic: {
            type: String,
            default: "",
        },
        followers: {  // corrected typo here as well from "followes" to "followers"
            type: [String],
            default: [],
        },
        following: {
            type: [String],
            default: [],
        },
        bio: {
            type: String,
            default: "",
        },
        isFrozen:{
            type:Boolean,
            default:false,
        },
    },
    {
        timestamps: true,  // corrected typo here
    }
);

const User = mongoose.model("User", userSchema);

export default User;
