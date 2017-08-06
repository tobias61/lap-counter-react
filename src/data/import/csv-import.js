import * as fs from 'fs';
import * as csv from 'csv';

class CSVImporter {
  filePath;
  encoding = 'UTF-8';

  constructor(filePath) {
    this.filePath = filePath;
  }

  loadCSV() {
    return new Promise((res, rej) => {
      fs.readFile(this.filePath, this.encoding, (err, file) => {
        if (err) {
          rej(err);
          return;
        }
        csv.parse(file, (err, data) => {
          err ? rej(err) : res(data);
        });
      });
    });
  }

  transformArraytoObject(input) {
    if (!input || input.length < 2) {
      return null;
    }

    const keys = input.shift();
    return input.map(row =>
      row.reduce((res, cur, index) => {
        res[keys[index]] = cur.replace(/^\s+|\s+$/g, '');
        return res;
      }, {}),
    );
  }
}

export default CSVImporter;
