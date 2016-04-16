'use strict';

var fs = require('fs');
var tarfs = require('tar-fs');
var zlib = require('zlib');

tarfs.pack('./node_modules', {
  map: function (header) {
    header.name = 'node_modules/' + header.name;
    return header;
  }
})
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('tar-fs.tar.gz'));

