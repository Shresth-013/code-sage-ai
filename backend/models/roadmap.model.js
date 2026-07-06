// backend/models/roadmap.model.js
import mongoose from "mongoose";

const weekSchema = new mongoose.Schema(
  {
    week: { type: Number, required: true },
    focus: { type: String, required: true },
    topics: { type: [String], default: [] },
    resources: { type: [String], default: [] },
    milestone: { type: String, required: true },
  },
  { _id: false }
);

const roadmapSchema = new mongoose.Schema({
  goal: { type: String, required: true },
  level: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
  weeksRequested: { type: Number, required: true },
  hoursPerWeek: { type: Number, required: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  weeks: { type: [weekSchema], default: [] },
  finalAdvice: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Roadmap", roadmapSchema);