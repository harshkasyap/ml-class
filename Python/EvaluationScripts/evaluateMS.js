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
8 10 30
Expected Output = 10 22 22 {7/8} {8/1 8/3 8/5 8/7}

#####Output#####
                `); 
                fs.outputFileSync(spawnFile, `gcc ${file} > error.txt 2>&1 -o execObject -lm && ./execObject > output1.txt`);
                fs.outputFileSync(expectFile, `expect -c 'spawn sh "spawnCmd.sh"; send "8 10 30\\r"; interact'`); 
                console.log(`Executing from ${path.basename(sourceFolder)}`)
                execSync(`sh "${expectFile}"`, {stdio: 'inherit'});
                
                // Case 1 output and validation if written.
                var output1Points = 0, output2Points = 0, output3Points = 0, output4Points = 0, output5Points = 0;
                if (fs.existsSync('output1.txt')) {
                  const output = fs.readFileSync('output1.txt').toString().toLowerCase();
                  fs.appendFileSync(progOutputFile, output);

                  // Case 1 Validation
                  // GCD Point
                  const regexA1 = /[\s\S]*?10[ \t\n]*/;
                  const matchA1 = regexA1.exec(output);
                  if (matchA1 !== null) {
                    output1Points = 8;
                  }
                  // Total No in Group 1
                  const regexA2 = /[\s\S]*?22[ \t\n]*/;
                  const matchA2 = regexA2.exec(output);
                  if (matchA2 !== null) {
                    output2Points = 3;
                  }

                  // Total No in Group 2
                  const regexA3 = /[\s\S]*?22[\s\S]*?22[ \t\n]*/;
                  const matchA3 = regexA3.exec(output);
                  if (matchA3 !== null) {
                    output2Points += 3;
                  }
                  // X
                  const regexA4 = /[\s\S]*?{[\s\S]*?7\/8[\s\S]*?}[ \t\n]*/;
                  const matchA4 = regexA4.exec(output);
                  if (matchA4 !== null) {
                    output3Points = 2;
                  }
                  // Y1
                  const regexA51 = /[\s\S]*?{[\s\S]*?8\/1[\s\S]*?}[ \t\n]*/;
                  const matchA51 = regexA51.exec(output);
                  if (matchA51 !== null) {
                    output4Points += 1;
                  }
                  // Y2
                  const regexA52 = /[\s\S]*?{[\s\S]*?8\/3[\s\S]*?}[ \t\n]*/;
                  const matchA52 = regexA52.exec(output);
                  if (matchA52 !== null) {
                    output4Points += 1;
                  }
                  // Y3
                  const regexA53 = /[\s\S]*?{[\s\S]*?8\/5[\s\S]*?}[ \t\n]*/;
                  const matchA53 = regexA53.exec(output);
                  if (matchA53 !== null) {
                    output4Points += 1;
                  }
                  // Y4
                  const regexA54 = /[\s\S]*?{[\s\S]*?8\/7[\s\S]*?}[ \t\n]*/;
                  const matchA54 = regexA54.exec(output);
                  if (matchA54 !== null) {
                    output4Points += 1;
                  }
                }

                // Add cases as many we want.

                // Delete Shell Files.
                fs.unlinkSync(spawnFile);
                fs.unlinkSync(expectFile);

                var totalPoints = output1Points + output2Points + output3Points + output4Points;
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
        Test Case 1 Passed(GCD): +8: ${output1Points}
        Test Case 2 Passed(Total No in Group 1 and 2): +6: ${output2Points}
        Test Case 4 Passed: +2(x values): ${output3Points}
        Test Case 5 Passed: +4(y values): ${output4Points}
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