var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/bottr');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Images = new Schema({ data: String, hashString: String });

var Images = mongoose.model('Images', Images);

module.exports = Images