const mongoose = require('mongoose');

// Create Lectures Schema
const lectureSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Science', 'Technology', 'Arts', 'Business', 'Education', 'Health', 'Social Sciences', 'Engineering', 'Humanities', 'Other']
    },
    date: {
      type: Date,
      default: Date.now
    }
  });
  
  // Add a compound index for "category" and "date"
  lectureSchema.index({ category: 1, date: -1 });
  
  // Create Lectures Model
  const Lecture = mongoose.model('Lecture', lectureSchema);
  
  // Export the Lecture model
  module.exports =  Lecture ;