const express = require('express');
const router = express.Router();
const DynamicModel = require('../Models/section');

// Function to fetch all documents
async function fetchAllDocuments() {
  try {
    const documents = await DynamicModel.find({}, 'fieldName field1 prompts').lean();
    return documents;
  } catch (error) {
    throw error;
  }
}

// Function to fetch a document by a specific field
async function fetchDocumentByField(fieldName, fieldValue) {
  try {
    const query = {};
    query[fieldName] = fieldValue;
    const document = await DynamicModel.findOne(query).lean();
    console.log('Fetched document:', JSON.stringify(document, null, 2));
    return document;
  } catch (error) {
    throw error;
  }
}

// API endpoint to get all documents
router.get('/documents', async (req, res) => {
  try {
    const documents = await fetchAllDocuments();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API endpoint to get a specific document by a field
router.get('/documents/:fieldName/:fieldValue', async (req, res) => {
  try {
    const document = await fetchDocumentByField(req.params.fieldName, req.params.fieldValue);
    if (document) {
      res.json(document);
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;