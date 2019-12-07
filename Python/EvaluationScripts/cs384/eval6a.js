const execSync = require('child_process').execSync;
const path = require('path');
const fs = require('fs-extra');
var Excel = require('exceljs');

// Path which contains all assignments with folders named with roll number.
// Run this code like
// node evaluate.js pathToFolderHavingAssignments ProgramToEvaluate logFileToBeGenerated EvaluatorsName rollNo
// eg. node evaluate.js CS prog1b.js prog1b.log Harsh
const evalPath = path.resolve(process.argv[2]);
const progNameToEvaluate = process.argv[3];
const evaluator = process.argv[5];
const progOutputFile = 'output.txt';
fs.readdirSync(evalPath).map((folder) => {
    const sourceFolder = `${evalPath}/${folder}`;
    if (folder.startsWith(process.argv[6]) && fs.lstatSync(sourceFolder).isDirectory()) {
        fs.readdirSync(sourceFolder).map((file) => {
            const sourceFile = `${sourceFolder}/${file}`;
            //console.log(file.toString())
            //console.log(sourceFile)
            if (file.toString().includes('py') && path.basename(sourceFile) === progNameToEvaluate) {
                process.chdir(sourceFolder);
                const spawnFile = `${sourceFolder}/spawnCmd.sh`;
                const expectFile = `${sourceFolder}/expect.sh`;
                var marks = 0;

                // Test Cases
                fs.outputFileSync(progOutputFile, '\nOutputs for Below Test Cases\n');

                var out1Marks1 = 0;

                // Case 1.
                fs.appendFileSync(progOutputFile, `

#####Input (Test Case 1)#####
Sample input: tt.csv
will check whether these subjs scheduled or not EE370,EE512,EE331,EE330,EE372,EE101,EE486,EE381,EE530,EE221	

#####Output#####
                `);
                var outFile = 'output1.txt';
                fs.outputFileSync(spawnFile, `python3.6 ${file} tt.csv > ${outFile}`);
                fs.outputFileSync(expectFile, `expect -c 'spawn sh "spawnCmd.sh"; send "1\\rEE\\r"; interact'`); 
                console.log(`Executing from ${path.basename(sourceFolder)}`)
                execSync(`sh "${expectFile}"`, {stdio: 'inherit'});
                
                // Case 1 output and validation if written.
                outFile = 'tt_EE.xlsx';

                fs.readdirSync(sourceFolder).map((file) => {
                  if (path.basename(file).includes('tt_EE')) {
                    outFile = path.basename(file)
                  }
                });
                
                if (fs.existsSync(outFile)) {
                  //const output = fs.readFileSync(outFile).toString().toUpperCase();
                  //fs.appendFileSync(progOutputFile, output);
                  //fs.unlinkSync(outFile);

                  var wb = new Excel.Workbook();
                  //var path = require('path');
                  var filePath = path.resolve(outFile);

                  textToVal = ''
                  // will check whether these subjs scheduled or not EE370,EE512,EE331,EE330,EE372,EE101,EE486,EE381,EE530,EE221
                  wb.xlsx.readFile(filePath).then(function(){
                      var sh = wb.getWorksheet("Sheet1");
                      //Get all the rows data [1st and 2nd column]
                      for (i = 2; i <= sh.rowCount; i++) {
                        for (j = 1; j <= 10; j++) {
                          textToVal += "\n";
                          textToVal += sh.getRow(i).getCell(j).value;
                        } 
                      }

                      fs.appendFileSync(progOutputFile, textToVal)

                      // Case 1 Validation
                      var regexM = /[\s\S]*?EE370[\s\S]*?/;
                      var matchR = regexM.exec(textToVal);
                      if (matchR !== null) {
                        out1Marks1 += 1;
                      }

                      var regexM = /[\s\S]*?EE512[\s\S]*?/;
                      var matchR = regexM.exec(textToVal);
                      if (matchR !== null) {
                        out1Marks1 += 1;
                      }

                      var regexM = /[\s\S]*?EE331[\s\S]*?/;
                      var matchR = regexM.exec(textToVal);
                      if (matchR !== null) {
                        out1Marks1 += 1;
                      }

                      var regexM = /[\s\S]*?EE330[\s\S]*?/;
                      var matchR = regexM.exec(textToVal);
                      if (matchR !== null) {
                        out1Marks1 += 1;
                      }

                      var regexM = /[\s\S]*?EE372[\s\S]*?/;
                      var matchR = regexM.exec(textToVal);
                      if (matchR !== null) {
                        out1Marks1 += 1;
                      }

                      var regexM = /[\s\S]*?EE381[\s\S]*?/;
                      var matchR = regexM.exec(textToVal);
                      if (matchR !== null) {
                        out1Marks1 += 1;
                      }

                      var regexM = /[\s\S]*?EE486[\s\S]*?/;
                      var matchR = regexM.exec(textToVal);
                      if (matchR !== null) {
                        out1Marks1 += 1;
                      }

                      var regexM = /[\s\S]*?EE370[\s\S]*?/;
                      var matchR = regexM.exec(textToVal);
                      if (matchR !== null) {
                        out1Marks1 += 1;
                      }

                      var regexM = /[\s\S]*?EE530[\s\S]*?/;
                      var matchR = regexM.exec(textToVal);
                      if (matchR !== null) {
                        out1Marks1 += 1;
                      }

                      var regexM = /[\s\S]*?EE221[\s\S]*?/;
                      var matchR = regexM.exec(textToVal);
                      if (matchR !== null) {
                        out1Marks1 += 1;
                      }

                      // Add cases as many we want.

                      // Delete Shell Files.
                      fs.unlinkSync(spawnFile);
                      fs.unlinkSync(expectFile);

                      var marks = out1Marks1;
                      if (marks === 0) {
                        marks = 2
                      }
                      // Writing to the Log File, Keep Comments as you like
                      const evaluationComments = `\n\nMARKS: ${marks}

      COMMENTS:
              Test Case 1 Passed: +10: ${out1Marks1}
              `;
                      const logFile = `${folder}_${process.argv[4]}`;
                      fs.outputFileSync(logFile, folder);
                      fs.appendFileSync(logFile, evaluationComments);
                      fs.appendFileSync(logFile, fs.readFileSync(progOutputFile).toString());
                      fs.appendFileSync(logFile, `\nEvaluated by: ${evaluator}`)
                      fs.unlinkSync(progOutputFile);
                  });
                  
                }                
            }
        });
    }
});