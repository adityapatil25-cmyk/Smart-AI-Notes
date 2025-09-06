/*import express from "express";
import { getSharedNote } from "../controllers/shareController.js";

const router = express.Router();

// Make it more specific to avoid conflicts
//router.get("/public/:shareId", getSharedNote);
router.get("/:shareId", getSharedNote);

export default router;
*/

import express from "express";
import { getSharedNote } from "../controllers/shareController.js";

const router = express.Router();

// Match the frontend call: /api/share/public/:shareId
router.get("/public/:shareId", getSharedNote);

export default router;