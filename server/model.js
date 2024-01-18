const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test');


const Model = mongoose.model('Test', {
    _id: Number,
    name: String 
});


const model = new Model();