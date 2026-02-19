const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  videoUrl:    { type: String, default: '' },
  description: { type: String, default: '' },
  order:       { type: Number, default: 0 },
});

const subjectSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    icon:        { type: String, default: '' },         // icon name / slug
    color:       { type: String, default: '#6366f1' },
    order:       { type: Number, default: 0 },
    topics:      [topicSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subject', subjectSchema);
