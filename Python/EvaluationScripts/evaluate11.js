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
(a+b

Expected Output = 
op.txt
(a + b : Malformed Expression
#####Output#####
                `); 
                fs.outputFileSync('ip.txt', `(a+b`);
                fs.outputFileSync('op.txt', '');
                fs.outputFileSync(spawnFile, `gcc ${file} > error.txt 2>&1 -o execObject -lm && ./execObject ip.txt op.txt > output1.txt`);
                fs.outputFileSync(expectFile, `expect -c 'spawn sh "spawnCmd.sh"; interact'`); 
                console.log(`Executing from ${path.basename(sourceFolder)}`)
                execSync(`sh "${expectFile}"`, {stdio: 'inherit'});
                
                // Case 1 output and validation if written.
                if (fs.existsSync('op.txt')) {
                  const output = fs.readFileSync('op.txt').toString().toLowerCase();
                  fs.appendFileSync(progOutputFile, output);

                  // Case 1 Validation
                  var regexM = /[\s\S]*?malformed[\s\S]*?/;
                  var matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks1 = 3;
                  }
                }

                // Case 2.
                fs.appendFileSync(progOutputFile, `

#####Input (Test Case 2)#####
ip.txt
a+b+

Expected Output = 
op.txt
a+b+ : Malformed Expression
#####Output#####
                `); 
                fs.outputFileSync('ip2.txt', `a+b+`);
                fs.outputFileSync('op2.txt', '');
                fs.outputFileSync(spawnFile, `gcc ${file} > error.txt 2>&1 -o execObject -lm && ./execObject ip2.txt op2.txt > output2.txt`);
                fs.outputFileSync(expectFile, `expect -c 'spawn sh "spawnCmd.sh"; interact'`); 
                console.log(`Executing from ${path.basename(sourceFolder)}`)
                execSync(`sh "${expectFile}"`, {stdio: 'inherit'});
                
                // Case 2 output and validation if written.
                if (fs.existsSync('op2.txt')) {
                  const output = fs.readFileSync('op2.txt').toString().toLowerCase();
                  fs.appendFileSync(progOutputFile, output);

                  // Case 1 Validation
                  var regexM = /[\s\S]*?malformed[\s\S]*?/;
                  var matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks2 = 3;
                  }
                }
                
                // Case 3.
                fs.appendFileSync(progOutputFile, `

#####Input (Test Case 3)#####
ip.txt
(a+b)*(c-d)

Expected Output = 
op.txt
(a+b)*(c-d): a b + c d - *
#####Output#####
                `); 
                fs.outputFileSync('ip3.txt', `(a+b)*(c-d)`);
                fs.outputFileSync('op3.txt', '');
                fs.outputFileSync(spawnFile, `gcc ${file} > error.txt 2>&1 -o execObject -lm && ./execObject ip3.txt op3.txt > output3.txt`);
                fs.outputFileSync(expectFile, `expect -c 'spawn sh "spawnCmd.sh"; interact'`); 
                console.log(`Executing from ${path.basename(sourceFolder)}`)
                execSync(`sh "${expectFile}"`, {stdio: 'inherit'});
                
                // Case 3 output and validation if written.
                if (fs.existsSync('op3.txt')) {
                  const output = fs.readFileSync('op3.txt').toString().toLowerCase();
                  fs.appendFileSync(progOutputFile, output);

                  // Case 3 Validation
                  var regexM = /[\s\S]*?\([\s\S]*?a[\s\S]*?b[\s\S]*?\)[\s\S]*?\*[\s\S]*?\([\s\S]*?c[\s\S]*?-[\s\S]*?d[\s\S]*?\)[\s\S]*?:[\s\S]*?a[\s\S]*?b[\s\S]*?\+[\s\S]*?c[\s\S]*?d[\s\S]*?-[\s\S]*?\*[\s\S]*?/;
                  var matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks3 = 4;
                  }
                }

                // Add cases as many we want.

                // Delete Shell Files.
                fs.unlinkSync(spawnFile);
                fs.unlinkSync(expectFile);

                var out1Marks = out1Marks1 + out1Marks2 + out1Marks3;
                var totalPoints = out1Marks;
                if (totalPoints > 0) {
                    marks += totalPoints;
                    // for late submission only
                    if (progNameToEvaluate === 'prog11l.c') {
                      deduct = marks / 4;
                    }
                    marks -= deduct;
                }
            
                // Writing to the Log File, Keep Comments as you like
                const evaluationComments = `\n\nMARKS: ${marks}

COMMENTS:
        Marks deducted due to late Submission: ${deduct}
        Test Case 1 Passed: +10(3+3+4): ${out1Marks}
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