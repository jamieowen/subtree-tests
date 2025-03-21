import * as ftp from 'basic-ftp';
import { sync } from 'glob';

const client = new ftp.Client();
client.ftp.verbose = true;

const paths = sync('dist/**/index*');

console.log(paths);

try {
  await client.access({
    host: '115.159.91.200',
    port: 21,
    user: 'lego_starwars_ar',
    password: '68iBmzsSWYHdfkY5',
    secure: false,
    // secure: true,
  });

  for (let path of paths) {
    let fromPath = path;
    let toPath = path.replace('dist/', '');
    console.log('Upload', fromPath);
    await client.uploadFrom(fromPath, toPath);
  }
} catch (err) {
  console.log(err);
} finally {
  client.close();
}
