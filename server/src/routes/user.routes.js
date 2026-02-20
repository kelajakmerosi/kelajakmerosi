const { Router } = require('express');
const {
  getProfile,
  updateProfile,
  getProgress,
  patchTopicProgress,
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

const router = Router();

router.get('/profile',         protect, getProfile);
router.put('/profile',         protect, updateProfile);
router.get('/progress',        protect, getProgress);
router.patch('/progress/:subjectId/:topicId', protect, patchTopicProgress);

module.exports = router;
