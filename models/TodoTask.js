const mongoose = require ('mongoose');
const todoTaskSchema = new mongoose.Schema
({
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    title:{ type: String, required: true},
    description:{ type: String, required: true},
    dueDate:{ type: Date, required: true},
    priority:{ type: String, enum: ['Low','Medium','High']},
    completed: { type: Boolean, default: false},
    
});

module.exports = mongoose.model('TodoTask',todoTaskSchema);
