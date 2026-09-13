import express from 'express';
import {
  submitOrUpdateTellGal,
  getMySubmission,
} from '../controllers/tellGalController.js';

const router = express.Router();

router.post('/', submitOrUpdateTellGal);
router.get('/my-submission', getMySubmission);

export default router;
