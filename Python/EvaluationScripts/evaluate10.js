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

                var out1Marks = 0, out1Marks1 = 0, out1Marks2 = 0, out1Marks3 = 0, out1Marks4 = 0, deduct = 0;

                // Case 1.
                fs.appendFileSync(progOutputFile, `

#####Input (Test Case 1)#####
ip.txt
2
P1 2
P2 3
P3 4
P4 10
P5 11
P6 12
P7 20
P8 25
P9 30
M P3 P6

Expected Output = 
op.txt
Group1: P1 P2 P3 P4 P5 P6 
Group2: P7 P8 P9
Mean1: 7
Mean2: 25
#####Output#####
                `); 
                fs.outputFileSync('ip.txt', `2\nP1 2\nP2 3\nP3 4\nP4 10\nP5 11\nP6 12\nP7 20\nP8 25\nP9 30\nM P3 P6`);
                fs.outputFileSync('op.txt', '');
                fs.outputFileSync(spawnFile, `gcc ${file} > error.txt 2>&1 -o execObject -lm && ./execObject ip.txt op.txt > output1.txt`);
                fs.outputFileSync(expectFile, `expect -c 'spawn sh "spawnCmd.sh"; interact'`); 
                console.log(`Executing from ${path.basename(sourceFolder)}`)
                execSync(`sh "${expectFile}"`, {stdio: 'inherit'});
                
                // Case 1 output and validation if written.
                if (fs.existsSync('op.txt')) {
                  const output = fs.readFileSync('op.txt').toString().toUpperCase();
                  fs.appendFileSync(progOutputFile, output);

                  // Case 1 Validation
                  var regexM = /[\s\S]*?GROUP1[\s\S]*?P1[\s\S]*?P2[\s\S]*?P3[\s\S]*?P4[\s\S]*?P5[\s\S]*?P6[ ]*?\n/;
                  var matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks1 = 2;
                  }

                  regexM = /[\s\S]*?GROUP2[^A-Z0-9]*?P7[\s\S]*?P8[\s\S]*?P9/;
                  matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks2 = 2;
                  }

                  regexM = /[\s\S]*?7.0[\s\S]*?/;
                  matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks3 = 3;
                  }

                  regexM = /[\s\S]*?25.0[\s\S]*?/;
                  matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks4 = 3;
                  }
                }

                // Add cases as many we want.

                // Delete Shell Files.
                fs.unlinkSync(spawnFile);
                fs.unlinkSync(expectFile);

                var out1Marks = out1Marks1 + out1Marks2 + out1Marks3 + out1Marks4;
                var totalPoints = out1Marks;
                if (totalPoints > 0) {
                    marks += totalPoints;
                    // for late submission only
                    if (progNameToEvaluate === 'prog10l.c') {
                      deduct = marks / 4;
                    }
                    marks -= deduct;
                }
            
                // Writing to the Log File, Keep Comments as you like
                const evaluationComments = `\n\nMARKS: ${marks}

COMMENTS:
        Marks deducted due to late Submission: ${deduct}
        Test Case 1 Passed: +10(2+2+3+3): ${out1Marks}
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