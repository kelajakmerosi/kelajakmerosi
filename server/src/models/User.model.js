const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name:     { type: String,  required: true, trim: true },
    email:    { type: String,  required: true, unique: true, lowercase: true, trim: true },
    password: { type: String,  select: false },
    avatar:   { type: String,  default: '' },
    role:     { type: String,  enum: ['student', 'admin'], default: 'student' },
    provider: { type: String,  enum: ['local', 'google'],  default: 'local' },
    googleId: { type: String },
    progress: [
      {
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
        completed: { type: Number, default: 0 },
        score:     { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

// ─── Hash password before save ────────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ─── Strip sensitive fields for API responses ─────────────────────────────────
userSchema.methods.toPublic = function () {
  const { _id, name, email, avatar, role, progress, createdAt } = this;
  return { id: _id, name, email, avatar, role, progress, createdAt };
};

module.exports = mongoose.model('User', userSchema);
