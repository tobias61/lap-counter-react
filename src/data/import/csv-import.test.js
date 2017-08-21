import CSVImporter from './csv-import';

describe('CSV Import',()=>{
  it('should prepare import', async () => {
    const importer = new CSVImporter('./import/Anmeldung-Privatperson.csv');
    const res = await importer.loadCSV();

    expect(res).toBeTruthy();
    expect(res.length).toBe(20);
    expect(res[0].length).toBe(8);
  });

  it('should transform array to object', () => {
    const input = [
      [
        'Submitted',
        'Vorname',
        'Name',
        'Geburtsdatum',
        'Geschlecht',
        'E-Mail',
        'Sponsor',
        'Möchtest Du uns noch etwas mitteilen?',
      ],
      [
        '2017-01-22 22:02:37',
        'Natascha',
        ' Freitag',
        '1995-08-01',
        'weiblich',
        'natascha.freitag@web.de',
        'Natascha Freitag',
        '',
      ],
    ];

    const importer = new CSVImporter('');
    let res = importer.transformArraytoObject(input);
    expect(res.length).toBe(1);
    expect(res[0]["Submitted"]).toEqual("2017-01-22 22:02:37");
    expect(res[0]["Vorname"]).toEqual("Natascha");
    expect(res[0]["Name"]).toEqual("Freitag");
    expect(res[0]["E-Mail"]).toEqual("natascha.freitag@web.de");
    expect(res[0]["Geschlecht"]).toEqual("weiblich");
    expect(res[0]["Sponsor"]).toEqual("Natascha Freitag");

  });

});
