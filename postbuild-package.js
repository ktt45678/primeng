const exec = require('child_process').exec;

const { name, version } = require('./package.json');

console.log('Changing package name...');

exec(`cd dist && npm pkg set name=${name} && npm pkg set version=${version}`, function (error, stdout, stderr) {
    console.log('Package updated\n');
});
