'use strict';

var camelCase = require('lodash.camelcase');
var crypto = require('crypto');
var execSync = require('child_process').execSync;
var fs = require('fs');
var hash = crypto.createHash('sha256');
var minimist = require('minimist');
var mkdirp = require('mkdirp');
var os = require('os');
var path = require('path');
var tarfs = require('tar-fs');
var zlib = require('zlib');

var flags = minimist(process.argv.slice(2), {
  alias: {
    n: 'dry-run'
  },
  default: {
    n: false
  }
});

// replace kabob-case with camelCase
Object.keys(flags).forEach(function (key) {
  var camel = camelCase(key);
  if (camel !== key) {
    flags[camel] = flags[key];
    delete flags[key];
  }
});

var shrinkwrapPath = path.resolve('npm-shrinkwrap.json');
if (!fs.existsSync(shrinkwrapPath)) {
  console.error(shrinkwrapPath + ' not found');
  process.exit(1);
}

var shrinkwrap = JSON.parse(fs.readFileSync(shrinkwrapPath));
var name = shrinkwrap.name;
var pkg = require('../package.json');

var snapshotDir = path.join(os.tmpdir(), pkg.name, name);

hash.update(fs.readFileSync(shrinkwrapPath));

var digest = hash.digest('hex');

var snapshot = path.join(snapshotDir, digest + '.tgz');

if (fs.existsSync(snapshot)) {
  console.log('Found snapshot at "' + snapshot + '"');

  console.log('Extracting to "' + process.cwd() + '/"...')
  if (!flags.dryRun) {
    fs.createReadStream(snapshot)
      .pipe(zlib.createGunzip())
      .pipe(tarfs.extract(process.cwd()));
  }
} else {
  console.log('No snapshot found at "' + snapshot + '"');

  var command = 'npm install';
  if (flags.npm) {
    var npmCliPath = path.resolve(flags.npm);
    command = npmCliPath + ' install';
  }

  console.log('Running "' + command + '" in "' + process.cwd() + '/"...')
  if (!flags.dryRun) {
    execSync(command, {
      env: process.env,
      stdio: [null, process.stdout, process.stderr]
    });
  }

  var node_modules_dir = path.resolve('node_modules');

  console.log('Packaging up "' + node_modules_dir + '/"...')
  if (!flags.dryRun) {
    mkdirp.sync(snapshotDir);

    tarfs.pack(node_modules_dir, {
        map: function (header) {
          header.name = 'node_modules/' + header.name;
          return header;
        }
      })
      .pipe(zlib.createGzip())
      .pipe(fs.createWriteStream(snapshot));
  }
}
