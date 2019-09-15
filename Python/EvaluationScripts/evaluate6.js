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
5 3 1 4 6 8 1 1
Expected Output = 1 3 8 3.8 1.6 4.4 6.1 8.3 22 59

#####Output#####
                `); 
                fs.outputFileSync(spawnFile, `gcc ${file} > error.txt 2>&1 -o execObject -lm && ./execObject > output1.txt`);
                fs.outputFileSync(expectFile, `expect -c 'spawn sh "spawnCmd.sh"; send "5 3 1 4 6 8 1 1\\r"; interact'`); 
                console.log(`Executing from ${path.basename(sourceFolder)}`)
                execSync(`sh "${expectFile}"`, {stdio: 'inherit'});
                
                // Case 1 output and validation if written.
                var output1Points = 0;
                if (fs.existsSync('output1.txt')) {
                  const output = fs.readFileSync('output1.txt').toString().toLowerCase();
                  fs.appendFileSync(progOutputFile, output);

                  // Case 1 Validation
                  const regexA11 = /[\s\S]*?1[ \t\n]+?3[ \t\n]+?8[ \n]*?/;
                  const regexA12 = /[\s\S]*?1[ \t\n]+?8[ \t\n]+?3[ \n]*?/;
                  const regexA13 = /[\s\S]*?3[ \t\n]+?1[ \t\n]+?8[ \n]*?/;
                  const regexA14 = /[\s\S]*?3[ \t\n]+?8[ \t\n]+?1[ \n]*?/;
                  const regexA15 = /[\s\S]*?8[ \t\n]+?1[ \t\n]+?3[ \n]*?/;
                  const regexA16 = /[\s\S]*?8[ \t\n]+?3[ \t\n]+?1[ \n]*?/;
                  const regexA2 = /[\s\S]*?22[\s\S]*?59/;
                  const regexA3 = /[\s\S]*?3\.[0-9]*?[\s\S]*?1\.[0-9]*?[\s\S]*?4\.[0-9]*?[\s\S]*?6\.[0-9]*?[\s\S]*?8\.[0-9]*?/;
                  const matchA11 = regexA11.exec(output);
                  const matchA12 = regexA12.exec(output);
                  const matchA13 = regexA13.exec(output);
                  const matchA14 = regexA14.exec(output);
                  const matchA15 = regexA15.exec(output);
                  const matchA16 = regexA16.exec(output);
                  if (matchA11 !== null || matchA12 !== null || matchA13 !== null || matchA14 !== null || matchA15 !== null || matchA16 !== null) {
                    output1Points += 3;
                  }
                  const matchA2 = regexA2.exec(output);
                  if (matchA2 !== null) {
                    output1Points += 2;
                  }
                  const matchA3 = regexA3.exec(output);
                  if (matchA3 !== null) {
                    output1Points += 5;
                  }
                }

                // Add cases as many we want.

                // Delete Shell Files.
                fs.unlinkSync(spawnFile);
                fs.unlinkSync(expectFile);

                var totalPoints = output1Points;
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
        Test Case 1 Passed: +10(3+5+2): ${output1Points}
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