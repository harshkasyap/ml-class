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
    if (folder.startsWith('1801') && fs.lstatSync(sourceFolder).isDirectory()) {
        fs.readdirSync(sourceFolder).map((file) => {
            const sourceFile = `${sourceFolder}/${file}`;
            if (path.basename(sourceFile) === progNameToEvaluate) {
                process.chdir(sourceFolder);
                const spawnFile = `${sourceFolder}/spawnCmd.sh`;
                const expectFile = `${sourceFolder}/expect.sh`;
                var marks = 0;

                // Test Cases
                fs.outputFileSync(progOutputFile, '\nOutputs for Below Test Cases\n');

                // Case 1.
                fs.appendFileSync(progOutputFile, `

#####Input (Test Case 1)#####
2 2 A 1 1
Expected Output = [B] Type 3 point

#####Output#####
                `); 
                fs.outputFileSync(spawnFile, `gcc ${file} > error.txt 2>&1 -o execObject -lm && ./execObject > output1.txt`);
                fs.outputFileSync(expectFile, `expect -c 'spawn sh "spawnCmd.sh"; send "2 2 A 1 1\\r"; interact'`); 
                console.log(`Executing from ${path.basename(sourceFolder)}`)
                execSync(`sh "${expectFile}"`, {stdio: 'inherit'});
                
                // Case 1 output and validation if written.
                var output1Points = 0;
                if (fs.existsSync('output1.txt')) {
                  const output = fs.readFileSync('output1.txt').toString();
                  fs.appendFileSync(progOutputFile, output);

                  // Case 1 Validation
                  const lines = output.toLowerCase().split('\n');
                  lines.forEach((line) => {
                    if (output1Points !== 4) {
                        if (line.indexOf('b') > -1) {
                            output1Points++;
                        }
                        if (line.indexOf('type') > -1) {
                            output1Points++;
                        }
                        if (line.indexOf('3') > -1) {
                            output1Points++;
                        }
                        if (line.indexOf('point') > -1) {
                            output1Points++;
                        }
                    } 
                  });
                }

                if (output1Points < 4) {
                    output1Points = 0;
                } else {
                    output1Points = 5;
                }

                // Case 2.
                fs.appendFileSync(progOutputFile, `

#####Input (Test Case 2)#####
2 2 A 6 8
Expected Output = [B K] Type 1 point

#####Output#####
                `); 
                fs.outputFileSync(spawnFile, `gcc ${file} > error.txt 2>&1 -o execObject -lm && ./execObject > output2.txt`);
                fs.outputFileSync(expectFile, `expect -c 'spawn sh "spawnCmd.sh"; send "2 2 A 6 8\\r"; interact'`); 
                console.log(`Executing from ${path.basename(sourceFolder)}`)
                execSync(`sh "${expectFile}"`, {stdio: 'inherit'});
                
                // Case 2 output and validation if written.
                var output2Points = 0;
                if (fs.existsSync('output2.txt')) {
                  const output = fs.readFileSync('output2.txt').toString();
                  fs.appendFileSync(progOutputFile, output);

                  // Case 2 Validation
                  const lines = output.toLowerCase().split('\n');
                  lines.forEach((line) => {
                    if (output2Points !== 5) {
                        if (line.indexOf('b') > -1) {
                            output2Points++;
                        }
                        if (line.indexOf('k') > -1) {
                            output2Points++;
                        }
                        if (line.indexOf('type') > -1) {
                            output2Points++;
                        }
                        if (line.indexOf('1') > -1) {
                            output2Points++;
                        }
                        if (line.indexOf('point') > -1) {
                            output2Points++;
                        }
                    }
                  });
                }

                if (output2Points < 5) {
                    output2Points = 0;
                } else {
                    output2Points = 5;
                }
                
                // Add cases as many we want.

                // Delete Shell Files.
                fs.unlinkSync(spawnFile);
                fs.unlinkSync(expectFile);

                var totalPoints = output1Points+output2Points;
                var corrLogicMarks = 0;
                if (totalPoints > 0) {
                    //corrLogicMarks = 2;
                    totalPoints += corrLogicMarks;
                    marks += totalPoints;
                }
            
                // Writing to the Log File, Keep Comments as you like
                const evaluationComments = `\n\nMARKS: ${marks}

COMMENTS:
        Wrong Logic/No Implementaion: 0
        Test Case 1 Passed: +5: ${output1Points}
        Test Case 2 Passed: +5: ${output2Points}
        `;
                const logFile = `${folder}_${process.argv[4]}`;
                fs.outputFileSync(logFile, folder);
                fs.appendFileSync(logFile, evaluationComments);
                fs.appendFileSync(logFile, "\nWarning And Errors\n");
                fs.appendFileSync(logFile, fs.readFileSync('error.txt').toString());
                fs.appendFileSync(logFile, fs.readFileSync(progOutputFile).toString());
                fs.appendFileSync(logFile, `\nEvaluated by: ${evaluator}`)
            }
        });
    }
});