import mongoose from "mongoose"

const { Schema, model } = mongoose

const BlogpostSchema = new Schema(
  {
    category: { type: String, required: true, },
    title: { type: String, required: true, },
    cover: { type: String, required: true, },
    readTime: { value: { type: Number, required: true, },
    unit: { type: String, required: true, },
    },
    users: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
    content: { type: String, required: true, },
    // comments: [ { comment: String, rate: Number, date: Date, }, ],
  },
  { timestamps: true }
)

export default model("Blogpost", BlogpostSchema)
