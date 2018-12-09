const app = require('./App');
const fs = require('fs');

const deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

const basePort = 5000;

module.exports = ({ data: { id } }) => {
    deleteFolderRecursive('./storage' + id);
    fs.mkdirSync('./storage' + id);
    process.basePath = './storage' + id;
    app.listen(basePort + id, () => console.log(`Storage listening on port ${basePort + id}!`))
}
