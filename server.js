const express = require('express');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const _ = require('lodash');

const app = express();

// Read and parse JSON file
let rawdata = fs.readFileSync('JEOPARDY_QUESTIONS1.json');
let data = JSON.parse(rawdata);

// Apply rate limits
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

//  Apply to all requests
app.use(limiter);

app.get('/jeopardy/data', (req, res) => {
  let count = parseInt(req.query.count) || 100;

  // Get subset of data based on count
  let subset = _.sampleSize(data, count);

  // Prepare response object
  let responseObject = subset.map(item => {
    return {
      category: item.category,
      air_date: item.air_date,
      question: item.question,
      value: item.value,
      answer: item.answer,
      show_number: item.show_number,
      round: item.round
    };
  });

  // Return response
  res.json(responseObject);
});

const port = process.env.PORT || 6969;
app.listen(port, () => console.log(`Server running on port ${port}`));
