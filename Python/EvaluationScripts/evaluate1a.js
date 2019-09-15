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
            if (path.extname(sourceFile) === '.c' && path.basename(sourceFile).indexOf('a') > -1) {
                process.chdir(sourceFolder);
                const spawnFile = `${sourceFolder}/spawnCmd.sh`;
                const expectFile = `${sourceFolder}/expect.sh`;
                var marks = 0;

                // Test Cases
                fs.outputFileSync(progOutputFile, '\nOutputs for Below Test Cases\n');

                // Case 1.
                fs.appendFileSync(progOutputFile, `

#####Input (Test Case 1)#####
1 2356 1
Expected Output = 2357

#####Output#####
                `); 
                fs.outputFileSync(spawnFile, `gcc ${file} > error.txt 2>&1 -o execObject -lm && ./execObject > output1.txt`);
                fs.outputFileSync(expectFile, `expect -c 'spawn sh "spawnCmd.sh"; send "1 2356 1\\r"; interact'`); 
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
                    if (line.indexOf('2357') > -1) {
                        output1Points = 2;
                    } 
                  });
                }
                // Case 2.
                fs.appendFileSync(progOutputFile, `

#####Input (Test Case 2)#####
2 1024 2
Expected Output = 1022

#####Output#####
                `); 
                fs.outputFileSync(spawnFile, `gcc ${file} > error.txt 2>&1 -o execObject -lm && ./execObject > output2.txt`);
                fs.outputFileSync(expectFile, `expect -c 'spawn sh "spawnCmd.sh"; send "2 1024 2\\r"; interact'`); 
                console.log(`Executing from ${path.basename(sourceFolder)}`)
                execSync(`sh "${expectFile}"`, {stdio: 'inherit'});
                
                // Case 1 output and validation if written.
                var output2Points = 0;
                if (fs.existsSync('output2.txt')) {
                  const output = fs.readFileSync('output2.txt').toString();
                  fs.appendFileSync(progOutputFile, output);

                  // Case 1 Validation
                  const lines = output.toLowerCase().split('\n');
                  lines.forEach((line) => {
                    if (line.indexOf('1022') > -1) {
                        output2Points = 2;
                    } 
                  });
                }

                // Case 3.
                fs.appendFileSync(progOutputFile, `

#####Input (Test Case 3)#####
3 400 3
Expected Output = 1200

#####Output#####
                `); 
                fs.outputFileSync(spawnFile, `gcc ${file} > error.txt 2>&1 -o execObject -lm && ./execObject > output3.txt`);
                fs.outputFileSync(expectFile, `expect -c 'spawn sh "spawnCmd.sh"; send "3 400 3\\r"; interact'`); 
                console.log(`Executing from ${path.basename(sourceFolder)}`)
                execSync(`sh "${expectFile}"`, {stdio: 'inherit'});
                
                // Case 1 output and validation if written.
                var output3Points = 0;
                if (fs.existsSync('output3.txt')) {
                  const output = fs.readFileSync('output3.txt').toString();
                  fs.appendFileSync(progOutputFile, output);

                  // Case 1 Validation
                  const lines = output.toLowerCase().split('\n');
                  lines.forEach((line) => {
                    if (line.indexOf('1200') > -1) {
                        output3Points = 2;
                    } 
                  });
                }

                // Case 4.
                fs.appendFileSync(progOutputFile, `

#####Input (Test Case 4)#####
4 800 4
Expected Output = 200

#####Output#####
                `); 
                fs.outputFileSync(spawnFile, `gcc ${file} > error.txt 2>&1 -o execObject -lm && ./execObject > output4.txt`);
                fs.outputFileSync(expectFile, `expect -c 'spawn sh "spawnCmd.sh"; send "4 800 4\\r"; interact'`); 
                console.log(`Executing from ${path.basename(sourceFolder)}`)
                execSync(`sh "${expectFile}"`, {stdio: 'inherit'});
                
                // Case 1 output and validation if written.
                var output4Points = 0;
                if (fs.existsSync('output4.txt')) {
                  const output = fs.readFileSync('output4.txt').toString();
                  fs.appendFileSync(progOutputFile, output);

                  // Case 1 Validation
                  const lines = output.toLowerCase().split('\n');
                  lines.forEach((line) => {
                    if (line.indexOf('200') > -1) {
                        output4Points = 2;
                    } 
                  });
                }

                // Add cases as many we want.

                // Delete Shell Files.
                fs.unlinkSync(spawnFile);
                fs.unlinkSync(expectFile);

                var totalPoints = output1Points+output2Points+output3Points+output4Points;
                var corrLogicMarks = 2;
                if (totalPoints > 0) {
                    totalPoints += corrLogicMarks;
                    marks += totalPoints;
                }
            
                // Writing to the Log File, Keep Comments as you like
                const evaluationComments = `\n\nMARKS: ${marks}

COMMENTS:
        Wrong Logic/No Implementaion: 0
        Compilation Succ/Err(Correct Logic): 2: ${corrLogicMarks}
        Test Case 1 Passed: +2: ${output1Points}
        Test Case 2 Passed: +2: ${output2Points}
        Test Case 3 Passed: +2: ${output3Points}
        Test Case 4 Passed: +2: ${output4Points}
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