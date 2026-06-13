// Local sanity test for the core logic outside n8n.
// Run: node src/test-locally.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function runN8nCodeNode(file, inputItems) {
  const code = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const wrapped = `(function(){ ${code} })()`;
  const context = {
    $input: {
      all: () => inputItems
    }
  };
  return vm.runInNewContext(wrapped, context);
}

const sample = runN8nCodeNode('generate-sample-data.js', []);
const metrics = runN8nCodeNode('calculate-flow-metrics.js', sample);
const summary = runN8nCodeNode('prepare-executive-summary.js', metrics);

console.log(summary[0].json.reportMarkdown);
