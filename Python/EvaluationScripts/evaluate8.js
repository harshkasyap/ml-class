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

                var mr1 = 0, mr2 = 0, mr3 = 0, mc1 = 0, mc2 = 0, mc3 = 0, deduct = 0;

                // Case 1.
                fs.appendFileSync(progOutputFile, `

#####Input (Test Case 1)#####
3
1234 E A B C D D
2312 A A A A A A
2121 B E E A B B

Expected Output = 
Lis sorted by roll no
1234 E A B C D D 8.05
2121 B E E A B B 9.00
2312 A A A A A A 9.00

List sorted by CGPA
2121 B E E A B B 9.00
2312 A A A A A A 9.00
1234 E A B C D D 8.05
#####Output#####
                `); 
                fs.outputFileSync(spawnFile, `gcc ${file} > error.txt 2>&1 -o execObject -lm && ./execObject > output1.txt`);
                fs.outputFileSync(expectFile, `expect -c 'spawn sh "spawnCmd.sh"; send "3 1234 E A B C D D 2312 A A A A A A 2121 B E E A B B\\r"; interact'`); 
                console.log(`Executing from ${path.basename(sourceFolder)}`)
                execSync(`sh "${expectFile}"`, {stdio: 'inherit'});
                
                // Case 1 output and validation if written.
                if (fs.existsSync('output1.txt')) {
                  const output = fs.readFileSync('output1.txt').toString().toLowerCase();
                  fs.appendFileSync(progOutputFile, output);

                  // Case 1 Validation
                  var regexM = /[\s\S]*?1234[\s\S]*?e[\s\S]*?a[\s\S]*?b[\s\S]*?c[\s\S]*?d[\s\S]*?d[\s\S]*?8[\s\S]*?/;
                  var matchR = regexM.exec(output);
                  if (matchR !== null) {
                    mr1 = 1;
                  }

                  regexM = /[\s\S]*?1234[\s\S]*?e[\s\S]*?a[\s\S]*?b[\s\S]*?c[\s\S]*?d[\s\S]*?d[\s\S]*?8[\s\S]*?2121[\s\S]*?b[\s\S]*?e[\s\S]*?e[\s\S]*?a[\s\S]*?b[\s\S]*?b[\s\S]*?9[\s\S]*?/;
                  matchR = regexM.exec(output);
                  if (matchR !== null) {
                    mr2 = 2;
                  }

                  regexM = /[\s\S]*?1234[\s\S]*?e[\s\S]*?a[\s\S]*?b[\s\S]*?c[\s\S]*?d[\s\S]*?d[\s\S]*?8[\s\S]*?2121[\s\S]*?b[\s\S]*?e[\s\S]*?e[\s\S]*?a[\s\S]*?b[\s\S]*?b[\s\S]*?9[\s\S]*?2312[\s\S]*?a[\s\S]*?a[\s\S]*?a[\s\S]*?a[\s\S]*?a[\s\S]*?a[\s\S]*?9[\s\S]*?/;
                  matchR = regexM.exec(output);
                  if (matchR !== null) {
                    mr3 = 2;
                  }
                  
                  regexM = /[\s\S]*?2121[\s\S]*?b[\s\S]*?e[\s\S]*?e[\s\S]*?a[\s\S]*?b[\s\S]*?b[\s\S]*?9[\s\S]*?/;
                  matchR = regexM.exec(output);
                  if (matchR !== null) {
                    mc1 = 1;
                  }

                  regexM = /[\s\S]*?2121[\s\S]*?b[\s\S]*?e[\s\S]*?e[\s\S]*?a[\s\S]*?b[\s\S]*?b[\s\S]*?9[\s\S]*?2312[\s\S]*?a[\s\S]*?a[\s\S]*?a[\s\S]*?a[\s\S]*?a[\s\S]*?a[\s\S]*?9[\s\S]*?/;
                  matchR = regexM.exec(output);
                  if (matchR !== null) {
                    mc2 = 2;
                  }

                  regexM = /[\s\S]*?2121[\s\S]*?b[\s\S]*?e[\s\S]*?e[\s\S]*?a[\s\S]*?b[\s\S]*?b[\s\S]*?9[\s\S]*?2312[\s\S]*?a[\s\S]*?a[\s\S]*?a[\s\S]*?a[\s\S]*?a[\s\S]*?a[\s\S]*?9[\s\S]*?1234[\s\S]*?e[\s\S]*?a[\s\S]*?b[\s\S]*?c[\s\S]*?d[\s\S]*?d[\s\S]*?8[\s\S]*?/;
                  matchR = regexM.exec(output);
                  if (matchR !== null) {
                    mc3 = 2;
                  }

                }

                // Add cases as many we want.

                // Delete Shell Files.
                fs.unlinkSync(spawnFile);
                fs.unlinkSync(expectFile);

                var totalPoints = mr1 + mr2 + mr3 + mc1 + mc2 + mc3;
                if (totalPoints > 0) {
                    marks += totalPoints;
                    // for late submission only
                    if (progNameToEvaluate === 'prog8l.c') {
                      deduct = marks / 4;
                    }
                    marks -= deduct;
                }
            
                // Writing to the Log File, Keep Comments as you like
                const evaluationComments = `\n\nMARKS: ${marks}

COMMENTS:
        Marks deducted due to late Submission: ${deduct}
        Test Case 1 Passed: +5(1+2+2): ${mr1+mr2+mr3}
        Test Case 2 Passed: +5(1+2+2): ${mc1+mc2+mc3}
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