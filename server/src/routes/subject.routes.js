const { Router } = require('express');
const {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} = require('../controllers/subject.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { validateBody, validateParams } = require('../middleware/validate.middleware');
const {
  SubjectPathParamsSchema,
  SubjectCreateSchema,
  SubjectUpdateSchema,
} = require('../../../shared/contracts');

const router = Router();

router.get('/',      protect, getAllSubjects);
router.get('/:id',   protect, validateParams(SubjectPathParamsSchema), getSubjectById);
router.post('/',     protect, adminOnly, validateBody(SubjectCreateSchema), createSubject);
router.put('/:id',   protect, adminOnly, validateParams(SubjectPathParamsSchema), validateBody(SubjectUpdateSchema), updateSubject);
router.delete('/:id',protect, adminOnly, validateParams(SubjectPathParamsSchema), deleteSubject);

module.exports = router;
