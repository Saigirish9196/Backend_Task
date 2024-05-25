import express from 'express';
import { deleteUser, test, updateProfile, userlist } from '../controllers/user.controller.js';
import { requireAuth } from '../middlewares/require.js';

const router = express.Router();
router.get('/test', test);
router.get('/users',userlist)
router.put("/update",requireAuth,updateProfile)
router.delete('/delete', requireAuth, deleteUser)

export default router;
