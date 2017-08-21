import * as async from 'async';
import * as path from 'path';
import CSVImporter from './csv-import';

export function postCSVImport(req, res) {
  console.log(req.files);
  // return res.status(200).send("Success");
  if (!req.files) return res.status(400).send('No files were uploaded.');

  const files = Object.keys(req.files).map(key => req.files[key]);


  let importRes = [];
  async.eachSeries(
    files,
    (file, callback) => {
      const filepath = path.resolve(
        `./import/${new Date().getTime()}_${file.name}`,
      );
      file.mv(filepath, err => {
        if (err) {
          callback(err);
          return;
        }
        const importer = new CSVImporter(filepath);
        importer
          .performImport()
          .then(res => {
            importRes = res;
            callback();
          })
          .catch(err => {
            callback(err);
          });
      });
    },
    err => {
      if (err) return res.status(500).send(err);
      res.jsonp(importRes);
    },
  );
}
