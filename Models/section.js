const mongoose = require('mongoose');

const dynamicSchema = new mongoose.Schema({}, { strict: false });

const DynamicModel = mongoose.model('DynamicData', dynamicSchema, 'sectiondatas');

module.exports = DynamicModel;
