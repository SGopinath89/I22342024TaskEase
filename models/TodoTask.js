const mongoose = require ('mongoose');
const todoTaskSchema = new mongoose.Schema(
    {
        content:
        {
            type: String,
            required: true
        },
        date:
        {
            type: Date,
            default: Date.now
        }
    }
)

module.exports = mongoose.model('TodoTask',todoTaskSchema);

//made and collection schema and exported it to use it at index.js