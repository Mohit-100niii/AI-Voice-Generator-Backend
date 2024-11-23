import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Schema for a text-audio pair
const TextAudioSchema = new Schema(
  {
    text: {
      type: String,
      required: true, // The text content
    },
    audioUrl: {
      type: String,
      // The URL of the generated audio file
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Compile the schema into a model
const TextAudio = mongoose.model("TextAudio", TextAudioSchema);

export default TextAudio;
