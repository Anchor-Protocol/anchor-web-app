const path = require('path');
const fs = require('fs');

const burnmap = require('./source/burnmap.json');
const mints = require('./source/mints.json');

const burnFile = path.join(__dirname, './transformed/burn.json');
const mintFile = path.join(__dirname, './transformed/mint.json');

const burnData = burnmap.map.reduce((data, {address, message}) => {
  data[address] = message;
  return data;
}, {});

const mintData = mints.list.reduce((data, {minter, amount}) => {
  data[minter] = amount;
  return data;
}, {});

fs.writeFileSync(burnFile, JSON.stringify(burnData));
fs.writeFileSync(mintFile, JSON.stringify(mintData));