// backend/models/conversation.model.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "model"], required: true },
    content: { type: String, required: true },
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  problem: { type: String, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
  messages: { type: [messageSchema], default: [] },
  // Optional — only set when the request came from a logged-in user.
  // Anonymous hint sessions keep working with userId left unset.
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Conversation", conversationSchema);