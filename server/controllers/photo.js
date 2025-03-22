import supabase from "../config/supabase.js";

import "dotenv/config";

const getAllPhotos = async (req, res) => {
  try {
    const user_id = req.user?.userId;
    if (!user_id) {
      return res.status(400).json({ message: "Cannot find user." });
    }
    const { data, error } = await supabase
      .from("photos")
      .select()
      .eq("user_id", user_id);

    res.status(200).json(data);
  } catch (error) {
    console.error(`API /photo/user/entries - General error:`, error);
    return res.status(500).json(`Error getting user entries: ${error}`);
  }
};

export { getAllPhotos };
