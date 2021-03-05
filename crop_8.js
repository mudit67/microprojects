const { exec } = require("child_process");
const fs = require("fs");
const path =  require('path');
const argv = (process.argv.splice(2))[0];
// console.log(argv);
fs.readdir(argv,(err,files) => {
    if(err){
        throw err;
    }
    // console.log(files);
    // var argv = process.argv;
    // console.log(argv);
    divide2(argv,files,divide4);
})
function divide2(arg,files,callback) {
  // console.log(arguments);
  makeFolder(arg);
    files.forEach(file => {
      var pathOriginal = path.join(arg,file)
      var pathConverted = path.join(makeFolderName(arg),file);
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
            divide4(`${pathConverted.substring(0,pathConverted.lastIndexOf('.'))}-0${pathConverted.substring(pathConverted.lastIndexOf('.'),pathConverted.length)}`);
            divide4(`${pathConverted.substring(0,pathConverted.lastIndexOf('.'))}-1${pathConverted.substring(pathConverted.lastIndexOf('.'),pathConverted.length)}`);
        });
    });
    // callback(arg);
}
function divide4(arg){
  var filePath = path.join(arg);
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
    fs.unlinkSync(filePath);
  });

}

function makeFolder(name){
  // console.log(name);
  var newFolder = makeFolderName(name);
  try {
      if (!fs.existsSync(newFolder)) {
        fs.mkdirSync(newFolder)
      }
    } catch (err) {
      console.error(err)
    }
}

function makeFolderName(name){
  // console.log(name);
  if(name.endsWith('/')){
    return (name.substring(0,name.length-1) + "-converted");
  }
  else{
    return (name + "-converted");
  }
}

// exec("ls -la", (error, stdout, stderr) => {
//     if (error) {
//         console.log(`error: ${error.message}`);
//         return;
//     }
//     if (stderr) {
//         console.log(`stderr: ${stderr}`);
//         return;
//     }
//     console.log(`stdout: ${stdout}`);
// });