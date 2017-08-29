import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';
import * as async from 'async';
import * as pdf from 'html-pdf';
import * as _ from 'lodash';
import * as base64img from 'base64-img';

export default function generateQRCodes(req, res) {
  const options = { format: 'Letter' };
  const html = fs.readFileSync(
    path.resolve('./src/requests/qr-code-sheet-template.html'),
    'utf8',
  );
  const filepath = path.resolve(`./tmp/${new Date().getTime()}_qrcodes.pdf`);

  const codes = [];
  for (let i = 100; i < 1000; i++) {
    codes.push({
      text: `${i}`,
    });
  }

  async.eachSeries(
    codes,
    (code, callback) => {
      QRCode.drawSvg(
        code.text,
        {
          errorCorrectionLevel: 'H',
        },
        (err, svgCode) => {
          if (err) {
            callback(err);
            return;
          }

          const codepath = path.resolve(`./tmp/qrcode_${code.text}.svg`);
          if (!fs.existsSync(codepath)) {
            fs.writeFile(codepath, svgCode, error => {
              code.image = codepath;
              callback(error);
            });
          } else {
            code.image = codepath;
            callback();
          }
        },
      );
    },
    err => {
      if (err) return res.status(500).send(err);

      // const logoBase64 = base64img.base64Sync(
      //   path.resolve(`./public/unicef_logo.jpg`),
      // );
      // console.log(logoBase64);
      const template = _.template(html);
      const assetPath = `file://${path.resolve('./')}/`;
      pdf
        .create(template({ codes }), {
          base: assetPath,
          timeout: 60000,
        })
        .toFile(filepath, (err, result) => {
          if (err) return res.status(500).send(err);
          res.sendFile(filepath);
        });
    },
  );
}
