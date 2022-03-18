
const { resolve } = require('path');
const { readdir } = require('fs').promises;
const fs = require('fs');
const yaml = require('js-yaml');
const outputDirectory = "./output/";
const originalDirectoryName = "originals";

class FileUtils {

    static async getFiles(dir) {
        const dirents = await readdir(dir, { withFileTypes: true });
        const files = await Promise.all(dirents.map((dirent) => {
          const res = resolve(dir, dirent.name);
          return dirent.isDirectory() ? FileUtils.getFiles(res) : res;
        }));
        return Array.prototype.concat(...files);
    }

    static convertFromJsonToYaml(file){
        try {
            const fileContents = fs.readFileSync(file, "utf8");
            const newYaml = yaml.dump(JSON.parse(fileContents))
            this.writeFile(file, newYaml);
          } catch (e) {
            console.log(e);
          }
    }

    static createDirectory(directory) {
        fs.mkdirSync(directory, { recursive: true }, (err) => {
            if (err) throw err;
          });
    }

    static writeFile(file, contents){
        this.createDirectory(outputDirectory);
        try {
            let originalDirectoryIndex = file.indexOf(originalDirectoryName);
            const substringStart = originalDirectoryIndex + originalDirectoryName.length + 1;
            let truncatedPath = file.substring(substringStart);
            if(truncatedPath.indexOf("/") > 0){
                // there is a subdirectory and we need to create it
                const lastSlashIndex = truncatedPath.lastIndexOf("/");
                const newDirectoryName = truncatedPath.substring(0, lastSlashIndex);
                this.createDirectory(outputDirectory+newDirectoryName);
            }
            truncatedPath = truncatedPath.replace(".json", ".yaml");
            const newFilePath = outputDirectory+truncatedPath;
            fs.writeFileSync(newFilePath, contents);
            console.log("Created new file", newFilePath);

          } catch (err) {
            console.error(err)
          }
    }

}

module.exports = FileUtils;

