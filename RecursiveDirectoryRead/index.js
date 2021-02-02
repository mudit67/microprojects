const fs = require('fs');
const path = require('path');
const dirPath = "./sample/"; //Path to directory which contains all the files,folders and sub-folders
let FilesArr = [];


setInterval(() => {
    FilesArrTemp = [];
    fs.readdir(dirPath, (err,files) => {
        if(err){
            console.log(err);
        }
        files.map((file) => {
            if(checkIfFile(path.join(dirPath,file))){
                FilesArrTemp.push(file);
            }
            else {
                FilesArrTemp.push(...returnDaughterFiles(file));                    
            }
        })
    });
    FilesArr = FilesArrTemp;
},1500);


setInterval(() => {
    console.log(FilesArr);
},2000);



function returnDaughterFiles(dirToCheck){
    let ReturnArr = [];
    let contents = [];
    try {
       contents = fs.readdirSync(path.join(dirPath,dirToCheck))
    }catch(err){
        console.log(err);
    }
    contents.forEach(file => {
        if(checkIfFile(path.join(dirPath,dirToCheck,file))){
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
