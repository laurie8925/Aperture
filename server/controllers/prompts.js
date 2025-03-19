import supabase from "../config/supabase.js";

import "dotenv/config";

//date formate
const date = new Date();
const formattedDate = date.toISOString().split("T")[0];

const getAllPrompts = async (req, res) => {
  const { data, error } = await supabase.from("prompts").select();

  if (error) {
    return res.status(500).json(`Error retrieving prompts: ${error}`);
  }
  res.status(200).json(data);
};

const getTodayPrompt = async (req, res) => {
  const { data, error } = await supabase
    .from("prompts")
    .select()
    .single()
    .eq("date", formattedDate);

  if (error) {
    return res.status(500).json(`Error retrieving today's prompt: ${error}`);
  }

  res.status(200).json(data);
};

export { getAllPrompts, getTodayPrompt };
