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
            if (path.extname(sourceFile) === '.c' && path.basename(sourceFile).indexOf('b') > -1) {
                process.chdir(sourceFolder);
                const spawnFile = `${sourceFolder}/spawnCmd.sh`;
                const expectFile = `${sourceFolder}/expect.sh`;
                var marks = 0;

                // Test Cases
                fs.outputFileSync(progOutputFile, '\nOutputs for Below Test Cases\n');

                // Case 1.
                fs.appendFileSync(progOutputFile, `

#####Input (Test Case 1)#####
9 2 6 2
Expected Output =
profitPercentage for MinMall is 29.05%
Paid price for MinMall is Rs 585
profitPercentage for MaxMall is 35.4%
Paid price for MaxMall is Rs 620
So, MaxMall will be more profitable

#####Output#####
                `); 
                fs.outputFileSync(spawnFile, `gcc ${file} > error.txt 2>&1 -o execObject -lm && ./execObject > output1.txt`);
                fs.outputFileSync(expectFile, `expect -c 'spawn sh "spawnCmd.sh"; send "9 2 6 2\\r"; interact'`); 
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
                    if (output1Points !== 5) {
                        if (line.indexOf('min') > -1 && line.indexOf('29') > -1) {
                            output1Points += 1;
                        }
                        if (line.indexOf('min') > -1 && line.indexOf('585') > -1) {
                            output1Points += 1;
                        }
                        if (line.indexOf('max') > -1 && line.indexOf('35') > -1) {
                            output1Points += 1;
                        }
                        if (line.indexOf('max') > -1 && line.indexOf('620') > -1) {
                            output1Points += 1;
                        }
                        if (line.indexOf('max') > -1 && line.indexOf('more') > -1) {
                            output1Points += 1;
                        }
                    } 
                  });
                }
 
                // Add cases as many we want.

                // Delete Shell Files.
                fs.unlinkSync(spawnFile);
                fs.unlinkSync(expectFile);

                var totalPoints = output1Points;
                var corrLogicMarks = 5;
                if (totalPoints > 0) {
                    totalPoints += corrLogicMarks;
                    marks += totalPoints;
                }
            
                // Writing to the Log File, Keep Comments as you like
                const evaluationComments = `\n\nMARKS: ${marks}

COMMENTS:
        Wrong Logic/No Implementaion: 0
        Compilation Succ/Err(Correct Logic): 5: ${corrLogicMarks}
        Correct IO: +5: ${output1Points}
        `;
                const logFile = `${folder}_${process.argv[4]}`;
                fs.outputFileSync(logFile, folder);
                fs.appendFileSync(logFile, evaluationComments);
                fs.appendFileSync(logFile, "\nWarning And Errors\n");
                if (fs.existsSync('error.txt')) {
                    fs.appendFileSync(logFile, fs.readFileSync('error.txt').toString());
                }
                fs.appendFileSync(logFile, fs.readFileSync(progOutputFile).toString());
                fs.appendFileSync(logFile, `\nEvaluated by: ${evaluator}`)
            }
        });
    }
});