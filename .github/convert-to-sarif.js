const fs = require('fs');

try {
  const results = JSON.parse(fs.readFileSync('eslint-results.json', 'utf8'));
  const sarif = {
    version: '2.1.0',
    $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
    runs: [{
      tool: {
        driver: {
          name: 'ESLint',
          version: '9.x',
          informationUri: 'https://eslint.org',
          rules: []
        }
      },
      results: results.flatMap(file => 
        file.messages.map(msg => ({
          ruleId: msg.ruleId,
          level: msg.severity === 2 ? 'error' : 'warning',
          message: { text: msg.message },
          locations: [{
            physicalLocation: {
              artifactLocation: { uri: file.filePath.replace(process.cwd() + '/', '') },
              region: { startLine: msg.line || 1, startColumn: msg.column || 1 }
            }
          }]
        }))
      )
    }]
  };
  fs.writeFileSync('eslint-results.sarif', JSON.stringify(sarif, null, 2));
} catch (e) {
  // If no results file or empty, create minimal valid SARIF
  const sarif = {
    version: '2.1.0',
    $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
    runs: [{
      tool: {
        driver: {
          name: 'ESLint',
          version: '9.x',
          informationUri: 'https://eslint.org',
          rules: []
        }
      },
      results: []
    }]
  };
  fs.writeFileSync('eslint-results.sarif', JSON.stringify(sarif, null, 2));
}