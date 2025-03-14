import { createClient } from "@supabase/supabase-js";

import "dotenv/config";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const getAllPrompts = async (req, res) => {
  console.log("get all prompts");
  const { data, error } = await supabase.from("prompts").select();
  console.log(data);

  if (error) {
    return res.status(500).json(`Error retrieving prompts: ${error}`);
  }

  res.status(200).json(data);
};

// const { data, error } = await supabase.from('todos').select()

export { getAllPrompts };
