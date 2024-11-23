import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
      fullname: {
        type: String,
        required: true, // User's full name
      },
      email: {
        type: String,
        required: true, // User's email
        unique: true,   // Ensure each email is unique
      },
    },
    {
      timestamps: true,
    }
  );
  
  // Compile the schema into a model
  const User = mongoose.model("User", UserSchema);
  
  export default User;
  