import express from "express";
import { filterMiddleware } from "../middleware/filterMiddleware.js";
import { fetchSearchResults } from "../services/proxyService.js";

const router = express.Router();

router.get("/", filterMiddleware, async (req, res) => {
  try {
    const query = req.query.q;

    const data = await fetchSearchResults(query);

    res.json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Proxy error",
      error: error.message
    });
  }
});

export default router;