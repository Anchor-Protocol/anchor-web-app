//const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

const { src } = require('../env');

const files = glob.sync(`${src}/@anchor-protocol/types/**/*.ts`);

const run = async (write) => {
  for (const file of files) {
    const realpath = path.resolve(__dirname, file);
    
    console.log('rewrite-paths.js..run()', realpath);
  }
}

run(false);