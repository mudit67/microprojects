const { exec } = require("child_process");
const fs = require("fs");
const path = require('path');
const argv = (process.argv.splice(2))[0];
// console.log(argv);
fs.readdir(argv, (err, files) => {
  if (err) {
    throw err;
  }
  // console.log(files);
  // var argv = process.argv;
  // console.log(argv);
  divide2(argv, files);
})
function divide2(arg, files) {
  // console.log(arguments);
  makeFolder(arg);
  files.forEach(file => {
    var pathOriginal = path.join(arg, file)
    var pathConverted = path.join(makeFolderName(arg,"c"), file);
    exec(`convert -crop 100%X50% \"${pathOriginal}\" \"${pathConverted}\"`, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      divide4(arg,`${file.substring(0, file.lastIndexOf('.'))}-0${file.substring(file.lastIndexOf('.'), file.length)}`);
      divide4(arg,`${file.substring(0, file.lastIndexOf('.'))}-1${file.substring(file.lastIndexOf('.'), file.length)}`);
    });
  });
  // callback(arg);
}
function divide4(Path,arg) {
  var filePath = makeFolderName(Path,"c")
  var filePath = path.join( filePath ,arg);
  exec(`convert -crop 50%X50% \"${filePath}\" \"${filePath}\"`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    // fs.unlinkSync(filePath);
    var newPath = path.join(makeFolderName(Path,"o"),arg);
    // console.log(newPath, filePath);
    fs.rename(filePath,newPath,() => {return});
  });

}

function makeFolder(name) {
  // console.log(name);
  var newFolder = makeFolderName(name, "c");
  try {
    if (!fs.existsSync(newFolder)) {
      fs.mkdirSync(newFolder)
    }
  } catch (err) {
    console.error(err)
  }
  newFolder = makeFolderName(name, "o");
  try {
    if (!fs.existsSync(newFolder)) {
      fs.mkdirSync(newFolder)
    }
  } catch (err) {
    console.error(err)
  }

}

function makeFolderName(name, ch) {
  // console.log(name);
  if (ch == "c") {
    if (name.endsWith('/')) {
      return (name.substring(0, name.length - 1) + "-converted");
    }
    else {
      return (name + "-converted");
    }
  }
  if (ch == "o") {
    if (name.endsWith('/')) {
      return (name.substring(0, name.length - 1) + "-org");
    }
    else {
      return (name + "-org");

    }
  }
}