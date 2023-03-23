const { spawnSync } = require('child_process');
const fs = require('fs');

const EXPECTED_PATH = 'test/expected';
const RESULT_PATH = 'test/badges';
const expectedFiles = {};

describe('validate badge generation', () => {
  beforeAll(() => {
    // load the expected files content to an object in order to compare it later with actual results
    fs.readdirSync(EXPECTED_PATH, (err, files) => {
      expect(err).toBeNull();
      files.forEach((file) => {
        const content = fs.readFileSync(`${EXPECTED_PATH}/${file}`, 'utf8');
        expectedFiles[file] = content;
      });
    });
  });

  beforeEach(() => {
    fs.readdirSync(RESULT_PATH, (err, files) => {
      expect(err).toBeNull();
      files.forEach((file) => {
        fs.unlink(`${RESULT_PATH}/${file}`, () => {});
      });
    });
  });

  it('should output a line coverage file', () => {
    // jest-coverage-badges --input './coverage/coverage-summary.json' --output 'badges'
    const result = spawnSync('node', ['cli.js', '--input', 'test/coverage-summary.json', '--output', RESULT_PATH]);
    expect(result.status).toBe(0);

    fs.readdirSync(EXPECTED_PATH, (err, files) => {
      expect(err).toBeNull();

      files.forEach((file) => {
        const content = fs.readFileSync(`${RESULT_PATH}/${file}`, 'utf8');
        expect(content).toEqual(expectedFiles[file]);
      });
    });
  });
});
