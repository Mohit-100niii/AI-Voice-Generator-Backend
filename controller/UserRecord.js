import TextAudio from "../model/TextAudio.js";
import User from "../model/User.js";



export const UserRecord = async (req, res) => {
    const { audiourl, inputText, fullname, email } = req.body;
    console.log(req.body)
    console.log("1");
    console.log("Request received at /api/savedaudio");


    try {
        // Find or create user
        
        let existedUser=await User.findOne({email});
        if(!existedUser)
        {
            existedUser = await User.create({ fullname, email });
        }
        

        // Save text-audio record
        const data = await TextAudio.create({
            userId: existedUser._id, // Update field name for user reference
            text: inputText,        
            audioUrl:audiourl
        });

        res.json({
            message: "Audio and text have been saved successfully.",
            data,
        });
        console.log(existedUser)
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(500).json({
            message: "Failed to save audio and text.",
            error: error.message,
        });
    }

   
};





export const getUserData = async (req, res) => {
    try {
        const email = req.query.email; // Get email from query params

        // Fetch user data based on email
        const UserData = await User.findOne({ email });

        if (!UserData) {
            return res.status(404).json({ message: "User not found" });
        }

        const userId = UserData._id.toString();

        const UserSavedData = await TextAudio.find({ userId }); // Match userId in TextAudio


        res.json({
            message: "Data Fetch Successfully",
            UserSavedData
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ message: "An error occurred" });
    }
};


export const deleteData = async (req, res) => {
    try {
      const { id } = req.query; // Correctly extract the id
      console.log("ID to delete:", id); // Debug log
  
      if (!id) {
        return res.status(400).json({ message: "ID is required" });
      }
  
      const deletedAudio = await TextAudio.findByIdAndDelete(id);
  
      if (!deletedAudio) {
        return res.status(404).json({ message: "Audio not found" });
      }
  
      res.json({ message: "Deletion successful", deletedAudio });
    } catch (error) {
      console.error("Error deleting audio:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  