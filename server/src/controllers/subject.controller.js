const Subject = require('../models/Subject.model');

// ─── GET /api/subjects ────────────────────────────────────────────────────────

exports.getAllSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.findAll();
    res.json(subjects);
  } catch (err) { next(err); }
};

// ─── GET /api/subjects/:id ────────────────────────────────────────────────────

exports.getSubjectById = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json(subject);
  } catch (err) { next(err); }
};

// ─── POST /api/subjects ───────────────────────────────────────────────────────

exports.createSubject = async (req, res, next) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json(subject);
  } catch (err) { next(err); }
};

// ─── PUT /api/subjects/:id ────────────────────────────────────────────────────

exports.updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.update(req.params.id, req.body);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json(subject);
  } catch (err) { next(err); }
};

// ─── DELETE /api/subjects/:id ─────────────────────────────────────────────────

exports.deleteSubject = async (req, res, next) => {
  try {
    const deleted = await Subject.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Subject not found' });
    res.status(204).end();
  } catch (err) { next(err); }
};
