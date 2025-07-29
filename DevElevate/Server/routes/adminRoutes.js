import express from "express";
import { 
  createAdminLog, 
  getAdminLogs
} from "../controller/adminLogController.js";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

// POST /api/admin/system-log - Create a new log entry
router.post("/system-log", createAdminLog);

// GET /api/admin/system-logs - Get logs with filtering and pagination
router.get("/system-logs", getAdminLogs);

export default router;
