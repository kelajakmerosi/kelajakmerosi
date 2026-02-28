const Subject = require('../models/Subject.model');
const ERROR_CODES = require('../constants/errorCodes');
const { sendError, sendSuccess } = require('../utils/http');

// ─── GET /api/subjects ────────────────────────────────────────────────────────

exports.getAllSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.findAll();
    return sendSuccess(res, subjects);
  } catch (err) { next(err); }
};

// ─── GET /api/subjects/:id ────────────────────────────────────────────────────

exports.getSubjectById = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return sendError(res, {
        status: 404,
        code: ERROR_CODES.ROUTE_NOT_FOUND,
        message: 'Subject not found',
        requestId: req.id,
      });
    }
    return sendSuccess(res, subject);
  } catch (err) { next(err); }
};

// ─── POST /api/subjects ───────────────────────────────────────────────────────

exports.createSubject = async (req, res, next) => {
  try {
    const subject = await Subject.create(req.body);
    return sendSuccess(res, subject, undefined, 201);
  } catch (err) { next(err); }
};

// ─── PUT /api/subjects/:id ────────────────────────────────────────────────────

exports.updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.update(req.params.id, req.body);
    if (!subject) {
      return sendError(res, {
        status: 404,
        code: ERROR_CODES.ROUTE_NOT_FOUND,
        message: 'Subject not found',
        requestId: req.id,
      });
    }
    return sendSuccess(res, subject);
  } catch (err) { next(err); }
};

// ─── DELETE /api/subjects/:id ─────────────────────────────────────────────────

exports.deleteSubject = async (req, res, next) => {
  try {
    const deleted = await Subject.remove(req.params.id);
    if (!deleted) {
      return sendError(res, {
        status: 404,
        code: ERROR_CODES.ROUTE_NOT_FOUND,
        message: 'Subject not found',
        requestId: req.id,
      });
    }
    return sendSuccess(res, { deleted: true }, undefined, 200);
  } catch (err) { next(err); }
};
