import cors from "cors";
import { generateQuest } from "../controllers/quest.controller.js";

const corsHandler = cors({ origin: true });

export const generateQuestHandler = async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      if (req.method === "OPTIONS") {
        res.set("Access-Control-Allow-Origin", "*");
        res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.set("Access-Control-Allow-Headers", "Content-Type");
        return res.status(204).send("");
      }

      if (req.method !== "POST") {
        return res.status(405).json({
          success: false,
          error: "Only POST method allowed"
        });
      }

      return await generateQuest(req, res);

    } catch (error) {
      console.error("Handler Error:", error);

      return res.status(500).json({
        success: false,
        error: error.message || "Handler failed"
      });
    }
  });
};