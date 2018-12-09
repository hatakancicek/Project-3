const fs = require('fs');
const  path = require('path');

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

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

const _Delete = ({ path }) => {
    const { basePath } = process;
    if(!path)
        throw "Invalid path";

    if (path === "/")
        throw "Can no remove root directory"

    const _path = 
        path === "/" 
            ? basePath
            : basePath + (path[0] === '/' ? path : '/' + path);
    const exists = fs.existsSync(_path);

    if(!exists)
        throw "Path doesn't exist";

    const isDir = fs.lstatSync(_path).isDirectory();
    if(isDir)
        return deleteFolderRecursive(_path)

    return fs.unlinkSync(_path);
};


exports.Read = ({ path }) => {
    const { basePath } = process;
    if(!path)
        throw "Invalid path";

    const _path = 
        path === "/" 
            ? basePath
            : basePath + (path[0] === '/' ? path : '/' + path);
    const exists = fs.existsSync(_path);

    if(!exists)
        throw "Path doesn't exist";

    const isDir = fs.lstatSync(_path).isDirectory();
    if(isDir)
        return {data: fs.readdirSync(_path), isDir: true}

    return {data: fs.readFileSync(_path, "utf-8"), isDir: false};
};

exports.Write = ({ path, data }) => {
    const { basePath } = process;
    if(!path)
        throw "Invalid path";

    const _path = 
        path === "/" 
            ? basePath
            : basePath + (path[0] === '/' ? path : '/' + path);
    const exists = fs.existsSync(_path);

    if(exists)
        _Delete({path})
    
    ensureDirectoryExistence(_path);
    fs.writeFileSync(_path, data, 'utf-8');

    return fs.readFileSync(_path);
};

exports.GetAttr = ({ path }) => {
    const { basePath } = process;
    if(!path)
        throw "Invalid path";

    const _path = 
        path === "/" 
            ? basePath
            : basePath + (path[0] === '/' ? path : '/' + path);

    return fs.lstatSync(_path)
};

exports.Delete = _Delete;