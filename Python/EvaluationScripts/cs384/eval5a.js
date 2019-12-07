const execSync = require('child_process').execSync;
const path = require('path');
const fs = require('fs-extra');

// Path which contains all assignments with folders named with roll number.
// Run this code like
// node evaluate.js pathToFolderHavingAssignments ProgramToEvaluate logFileToBeGenerated EvaluatorsName
// eg. node evaluate.js CS prog1b.js prog1b.log Harsh
const evalPath = path.resolve(process.argv[2]);
const progNameToEvaluate = process.argv[3];
const evaluator = process.argv[5];
const progOutputFile = 'output.txt';
fs.readdirSync(evalPath).map((folder) => {
    const sourceFolder = `${evalPath}/${folder}`;
    if (folder.startsWith('1701') && fs.lstatSync(sourceFolder).isDirectory()) {
        fs.readdirSync(sourceFolder).map((file) => {
            const sourceFile = `${sourceFolder}/${file}`;
            if (path.basename(sourceFile) === progNameToEvaluate) {
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
Sample input: 
Check only this file Input_file_octant_frequency.csv 
The numbers should match. Grep these numbers
2361	
5371	
5428	
2495	
4492	
2180	
2449	
5224	

#####Output#####
                `);
                var outFile = 'output1.txt';
                fs.outputFileSync(spawnFile, `python3.6 ${file} 7.15_cm_vel_ns.csv > ${outFile}`);
                fs.outputFileSync(expectFile, `expect -c 'spawn sh "spawnCmd.sh"; send "\\r"; interact'`); 
                console.log(`Executing from ${path.basename(sourceFolder)}`)
                execSync(`sh "${expectFile}"`, {stdio: 'inherit'});
                
                // Case 1 output and validation if written.
                outFile = '7.15_cm_vel_ns_octant_frequency.csv';

                fs.readdirSync(sourceFolder).map((file) => {
                  if (path.basename(file).includes('frequency')) {
                    outFile = path.basename(file)
                  }
                });
 

                if (fs.existsSync(outFile)) {
                  const output = fs.readFileSync(outFile).toString().toUpperCase();
                  fs.appendFileSync(progOutputFile, output);
                  fs.unlinkSync(outFile);

                  // Case 1 Validation
                  var regexM = /[\s\S]*?2361[\s\S]*?/;
                  var matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks1 += 1;
                  }

                  var regexM = /[\s\S]*?5371[\s\S]*?/;
                  var matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks1 += 1;
                  }

                  var regexM = /[\s\S]*?5428[\s\S]*?/;
                  var matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks1 += 1;
                  }

                  var regexM = /[\s\S]*?2495[\s\S]*?/;
                  var matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks1 += 1;
                  }

                  var regexM = /[\s\S]*?4492[\s\S]*?/;
                  var matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks1 += 1;
                  }

                  var regexM = /[\s\S]*?2180[\s\S]*?/;
                  var matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks1 += 1;
                  }

                  var regexM = /[\s\S]*?2449[\s\S]*?/;
                  var matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks1 += 2;
                  }

                  var regexM = /[\s\S]*?5224[\s\S]*?/;
                  var matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks1 += 2;
                  }

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
            }
        });
    }
});