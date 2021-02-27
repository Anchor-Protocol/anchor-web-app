const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

const { src } = require('../env');

const files = glob.sync(`${src}/@anchor-protocol/types/**/*.ts`);

const template = (interfaceName) => `
export interface ${interfaceName} {

}

export interface ${interfaceName}Response {

}
`;

const run = async (write) => {
  for (const file of files) {
    const realpath = path.resolve(__dirname, file);
    const stat = await fs.stat(realpath);

    if (stat.size === 0) {
      const name = path.basename(file, '.ts');
      const interfaceName = name[0].toUpperCase() + name.slice(1);

      if (write) {
        await fs.writeFile(realpath, template(interfaceName), {
          encoding: 'utf8',
        });
      } else {
        console.log(realpath);
      }
    }
  }
};

run(false);
