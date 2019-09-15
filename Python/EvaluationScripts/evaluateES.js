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
5 6

Expected Output = 
0 4 16 36 64 100 
1 5 17 37 65 101 
4 8 20 40 68 104 
9 13 25 45 73 109 
16 20 32 52 80 116

0 4 16 36 64 100 101 104 109 116 80 52 32 20 16 9 4 1 5 17 37 65 68 73 45 25 13 8 20 40
#####Output#####
                `); 
                fs.outputFileSync(spawnFile, `gcc ${file} > error.txt 2>&1 -o execObject -lm && ./execObject > output1.txt`);
                fs.outputFileSync(expectFile, `expect -c 'spawn sh "spawnCmd.sh"; send "5 6\\r"; interact'`); 
                console.log(`Executing from ${path.basename(sourceFolder)}`)
                execSync(`sh "${expectFile}"`, {stdio: 'inherit'});
                
                // Case 1 output and validation if written.
                if (fs.existsSync('output1.txt')) {
                  const output = fs.readFileSync('output1.txt').toString().toLowerCase();
                  fs.appendFileSync(progOutputFile, output);

                  // Case 1 Validation
                  var regexM = /[\s\S]*?0[\s\S]*?4[\s\S]*?16[\s\S]*?36[\s\S]*?64[\s\S]*?100[\s\S]*?1[\s\S]*?5[\s\S]*?17[\s\S]*?37[\s\S]*?65[\s\S]*?101[\s\S]*?4[\s\S]*?8[\s\S]*?20[\s\S]*?40[\s\S]*?68[\s\S]*?104[\s\S]*?9[\s\S]*?13[\s\S]*?25[\s\S]*?45[\s\S]*?73[\s\S]*?109[\s\S]*?16[\s\S]*?20[\s\S]*?32[\s\S]*?52[\s\S]*?80[\s\S]*?116[\s\S]*?/;
                  var matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks1 = 10;
                  }

                  regexM = /[\s\S]*?0[\s\S]*?4[\s\S]*?16[\s\S]*?36[\s\S]*?64[\s\S]*?100[\s\S]*?101[\s\S]*?104[\s\S]*?109[\s\S]*?116[\s\S]*?80[\s\S]*?52[\s\S]*?32[\s\S]*?20[\s\S]*?16[\s\S]*?9[\s\S]*?4[\s\S]*?1[\s\S]*?5[\s\S]*?17[\s\S]*?37[\s\S]*?65[\s\S]*?68[\s\S]*?73[\s\S]*?45[\s\S]*?25[\s\S]*?13[\s\S]*?8[\s\S]*?20[\s\S]*?40[\s\S]*?/;
                  matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks2 = 10;
                  }
                }
                // Add cases as many we want.

                // Delete Shell Files.
                fs.unlinkSync(spawnFile);
                fs.unlinkSync(expectFile);

                var out1Marks = out1Marks1 + out1Marks2;
                var totalPoints = out1Marks;
                if (totalPoints > 0) {
                    marks += totalPoints;
                    // for late submission only
                    if (progNameToEvaluate === 'endseml.c') {
                      deduct = marks / 4;
                    }
                    marks -= deduct;
                }
            
                // Writing to the Log File, Keep Comments as you like
                const evaluationComments = `\n\nMARKS: ${marks}

COMMENTS:
        Marks deducted due to late Submission: ${deduct}
        Test Case 1 Passed: +10: ${out1Marks1}
        Test Case 2 Passed: +10: ${out1Marks2}
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