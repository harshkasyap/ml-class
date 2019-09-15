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

                var out1Marks = 0, out2Marks = 0, deduct = 0;

                // Case 1.
                fs.appendFileSync(progOutputFile, `

#####Input (Test Case 1)#####
TRAIL-BLAZERS: ATTACK AT DAWN;

Expected Output = 
TPPTAD TP ITVH
#####Output#####
                `); 
                fs.outputFileSync(spawnFile, `gcc ${file} > error.txt 2>&1 -o execObject -lm && ./execObject > output1.txt`);
                fs.outputFileSync(expectFile, `expect -c 'spawn sh "spawnCmd.sh"; send "TRAIL-BLAZERS: ATTACK AT DAWN;\\r"; interact'`); 
                console.log(`Executing from ${path.basename(sourceFolder)}`)
                execSync(`sh "${expectFile}"`, {stdio: 'inherit'});
                
                // Case 1 output and validation if written.
                if (fs.existsSync('output1.txt')) {
                  const output = fs.readFileSync('output1.txt').toString().toUpperCase();
                  fs.appendFileSync(progOutputFile, output);

                  // Case 1 Validation
                  var regexM = /[\s\S]*?TPPTAD[\s\S]*?TP[\s\S]*?ITVH[\s\S]*?/;
                  var matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks = 5;
                  }
                }

                // Case 2.
fs.appendFileSync(progOutputFile, `

#####Input (Test Case 2)#####
TRAIL @123# BLAZERS: DAWN AT ATTACK @123# ATTACK AT DAWN;

Expected Output = 
ITVH TP TPPTAD @123# TPPTAD TP ITVH
#####Output#####
                `); 
                fs.outputFileSync(spawnFile, `gcc ${file} > error.txt 2>&1 -o execObject -lm && ./execObject > output2.txt`);
                fs.outputFileSync(expectFile, `expect -c 'spawn sh "spawnCmd.sh"; send "TRAIL @123# BLAZERS: DAWN AT ATTACK @123# ATTACK AT DAWN;\\r"; interact'`); 
                console.log(`Executing from ${path.basename(sourceFolder)}`)
                execSync(`sh "${expectFile}"`, {stdio: 'inherit'});
                
                // Case 2 output and validation if written.
                if (fs.existsSync('output2.txt')) {
                  const output2 = fs.readFileSync('output2.txt').toString().toUpperCase();
                  fs.appendFileSync(progOutputFile, output2);

                  // Case 2 Validation
                  var regexM = /[\s\S]*?ITVH[\s\S]*?TP[\s\S]*?TPPTAD[\s\S]*?TPPTAD[\s\S]*?TP[\s\S]*?ITVH[\s\S]*?/;
                  var matchR = regexM.exec(output2);
                  if (matchR !== null) {
                    out2Marks = 5;
                  }
                }

                // Add cases as many we want.

                // Delete Shell Files.
                fs.unlinkSync(spawnFile);
                fs.unlinkSync(expectFile);

                var totalPoints = out1Marks + out2Marks;
                if (totalPoints > 0) {
                    marks += totalPoints;
                    // for late submission only
                    if (progNameToEvaluate === 'prog9l.c') {
                      deduct = marks / 4;
                    }
                    marks -= deduct;
                }
            
                // Writing to the Log File, Keep Comments as you like
                const evaluationComments = `\n\nMARKS: ${marks}

COMMENTS:
        Marks deducted due to late Submission: ${deduct}
        Test Case 1 Passed: +5(1+2+2): ${out1Marks}
        Test Case 2 Passed: +5(1+2+2): ${out2Marks}
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