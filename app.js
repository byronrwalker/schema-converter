const path = require('path');
const fs = require('fs');

const FileUtils = require ("./utils/FileUtils");
const { getFiles } = require('./utils/FileUtils');

const directoryPath = path.join(__dirname, 'originals');

FileUtils.getFiles(directoryPath).then(files => {
  for(let file of files){
    FileUtils.convertFromJsonToYaml(file);
  }
})
.catch(e => console.error(e));

