const { Router } = require('express');
const {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} = require('../controllers/subject.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

const router = Router();

router.get('/',      protect, getAllSubjects);
router.get('/:id',   protect, getSubjectById);
router.post('/',     protect, adminOnly, createSubject);
router.put('/:id',   protect, adminOnly, updateSubject);
router.delete('/:id',protect, adminOnly, deleteSubject);

module.exports = router;
