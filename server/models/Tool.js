import mongoose from "mongoose";
import Post from "./Post.js";

const Schema = mongoose.Schema;

const ToolSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        maker: {
            type: String,
            required: true
        },
        model: {
            type: String,
            required: true
        },
        shortDescription: {
            type: String,
            required: true,
            max: 50
        },
        longDescription: {
            type: String,
            required: true
        },
        images: [{
            type: String,
            default: "",
        }]
    }, { timestamps: true }
);

ToolSchema.post("save", async function (tool) {
    const User = mongoose.model("User");
    const user = await User.findById(tool.userId);
    const post = new Post({
        userId: tool.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        description: `${tool.maker}, ${tool.model} \n ${tool.longDescription} `,
        picturePath: tool.images[0],
        userPicturePath: user.picturePath,
    });

    try {
        await post.save(); // Save the new post
    } catch (error) {
        console.error("Error creating post:", error);
    }
});

const Tool = mongoose.model('Tool', ToolSchema);
export default Tool;
