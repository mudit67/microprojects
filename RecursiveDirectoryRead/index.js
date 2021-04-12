const fs = require("fs");
const path = require("path");

// Function to return whether the argument (path) refers to a directory or a file
const checkIfFile = (pathToCheck) =>
  fs.lstatSync(path.join(pathToCheck)).isFile();

// console.log(returnDaughterFiles("src"));
function returnDaughterFiles(dirToCheck) {
  //function to return all the files present in the dirToCheck Directory and all sub-directory

  let ReturnArr = []; // temporary arr to hold all files in dirToCheck and also in its sub-folders
  let contents = []; // temporary arr to hold files and folder contained in dirToCheck and not in its sub-folders maxDepth=0
  try {
    contents = fs.readdirSync(dirToCheck);
  } catch (err) {
    console.log(err);
  }
  contents.forEach((file) => {
    if (checkIfFile(path.join(dirToCheck,file))) {
      //check if "file" is a file or not
      ReturnArr.push(file);
    } else {
      ReturnArr.push(...returnDaughterFilesWithoutPath(dirToCheck,file));
    }
  });
  return ReturnArr;
}

function returnDaughterFilesWithoutPath(rootDir,dirToCheck) {
  let ReturnArr = []; // temporary arr to hold all files in dirToCheck and also in its sub-folders
  let contents = []; // temporary arr to hold files and folder contained in dirToCheck and not in its sub-folders maxDepth=0
  try {
    contents = fs.readdirSync(path.join(rootDir,dirToCheck));
  } catch (err) {
    console.log(err);
  }
  contents.forEach((file) => {
    if (checkIfFile(path.join(rootDir,dirToCheck,file))) {
      //check if "file" is a file or not
      ReturnArr.push(dirToCheck+"/"+file);
    } else {
      ReturnArr.push(...returnDaughterFilesWithoutPath( rootDir , (dirToCheck+"/"+file)));
    }
  });
  return ReturnArr;
}

module.exports = returnDaughterFiles;
