const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rightSchema = new Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String
    
}, { timestamps: true });

const Right = mongoose.model('Right', rightSchema);
module.exports = Right;