const mongoose = require ('mongoose');
const todoTaskSchema = new mongoose.Schema
({
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    title:{ type: String, required: true},
    description:String,
    dueDate: Date,
    priority:{ type: String, enum: ['Low','Medium','High'], default: 'Medium'},
    completed: { type: Boolean, default: false},
    
});

module.exports = mongoose.model('TodoTask',todoTaskSchema);

//made and collection schema and exported it to use it at index.js