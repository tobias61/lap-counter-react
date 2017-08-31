import * as fs from 'fs';
import * as csv from 'csv';
import * as async from 'async';
import Runner from '../models/Runner';
import Sponsor from '../models/Sponsor';
import Team from '../models/Team';

class CSVImporter {
  filePath;
  encoding = 'UTF-8';

  constructor(filePath) {
    this.filePath = filePath;
  }

  performImport() {
    return this.loadCSV().then(
      res =>
        new Promise((finish, reject) => {
          const data = this.transformArraytoObject(res);

          let users = [];
          async.eachSeries(
            data,
            (item, callback) => {
              if (item['Vorname Läufer 1']) {
                Sponsor.count({
                  where: {
                    email: item['E-Mail'],
                    insert: item.Submitted,
                  },
                }).then(count => {
                  if (count === 0) {
                    Sponsor.create({
                      email: item['E-Mail'],
                      contact_firstName: item.Vorname,
                      contact_lastName: item.Name,
                      name:
                        item['Name Firma / Verein / Schule o. ä.'] ||
                        `${item.Vorname} ${item.Name}`,
                      insert: item.Submitted,
                      personal: false,
                    })
                      .then(sponsor => {
                        Team.create({
                          name:
                            item['Name Firma / Verein / Schule o. ä.'] ||
                            `${item.Vorname} ${item.Name}`,
                          sponsor_id: sponsor.id,
                          insert: item.Submitted,
                        }).then(team => {
                          const runners = [];
                          for (let i = 1; i <= 30; i++) {
                            if (item[`Vorname Läufer ${i}`]) {
                              const runnerConf = {
                                lastName: item[`Name Läufer ${i}`],
                                firstName: item[`Vorname Läufer ${i}`],
                                gender: item[`Geschlecht Läufer ${i}`],
                                birthday: item[`Geburtsdatum Läufer ${i}`],
                                team_id: team.id,
                                insert: item.Submitted,
                              };
                              runners.push(runnerConf);
                            }
                          }
                          Runner.bulkCreate(runners)
                            .then(res => {
                              users = runners;
                              callback();
                            })
                            .catch(err => {
                              callback();
                            });
                        });
                      })
                      .catch(err => {
                        callback();
                      });
                  } else {
                    callback();
                  }
                });
              } else {
                Sponsor.count({
                  where: {
                    email: item['E-Mail'],
                    insert: item.Submitted,
                  },
                }).then(count => {
                  if (count === 0) {
                    Sponsor.create({
                      email: item['E-Mail'],
                      contact_firstName: item.Vorname,
                      contact_lastName: item.Name,
                      name: item.Sponsor || `${item.Vorname} ${item.Name}`,
                      insert: item.Submitted,
                      personal: true,
                    })
                      .then(sponsor => {
                        Runner.create({
                          email: item['E-Mail'],
                          lastName: item.Name,
                          firstName: item.Vorname,
                          gender: item.Geschlecht,
                          birthday: item[`Geburtsdatum`],
                          sponsor_id: sponsor.id,
                          insert: item.Submitted,
                        })
                          .then(res => {
                            users.push(res);
                            callback();
                          })
                          .catch(err => {
                            callback();
                          });
                      })
                      .catch(err => {
                        callback();
                      });
                  } else {
                    callback();
                  }
                });
              }
            },
            err => {
              if (err) {
                reject(err);
              } else {
                finish(users);
              }
            },
          );
        }),
    );
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
