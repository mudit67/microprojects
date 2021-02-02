const fs = require('fs');
const path = require('path');
const dirPath = "./sample/"; //Path to directory which contains all the files,folders and sub-folders
let FilesArr = [];
// setInterval(() => {
    FilesArr = returnDaughterFiles(dirPath);
// },1500);


// setTimeout(() => {
    console.log(FilesArr);
// },2000);



function returnDaughterFiles(dirToCheck){
    let ReturnArr = [];
    let contents = [];
    try {
       contents = fs.readdirSync(dirToCheck)
    }catch(err){
        console.log(err);
    }
    contents.forEach(file => {
        if( fs.lstatSync( path.join(dirToCheck,file) ).isFile() ){
            ReturnArr.push(path.join(dirToCheck,file));
        }
        else{
            ReturnArr.push(...returnDaughterFiles(path.join(dirToCheck,file)));
        }
    });
    return(ReturnArr);
}
// Function to return whether the argument (path) refers to a directory or a file
const checkIfFile = path => fs.lstatSync(path).isFile();
