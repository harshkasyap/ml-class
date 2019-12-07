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
    if (folder.startsWith('1701') && fs.lstatSync(sourceFolder).isDirectory()) {
        fs.readdirSync(sourceFolder).map((file) => {
            const sourceFile = `${sourceFolder}/${file}`;
            if (path.basename(sourceFile) === progNameToEvaluate) {
                process.chdir(sourceFolder);
                const spawnFile = `${sourceFolder}/spawnCmd.sh`;
                const expectFile = `${sourceFolder}/expect.sh`;
                var marks = 0;

                // Test Cases
                fs.outputFileSync(progOutputFile, '\nOutputs for Below Test Cases\n');

                var out1Marks1 = 0, out1Marks2 = 0, out1Marks3 = 0, out1Marks4 = 0;

                // Case 1.
                fs.appendFileSync(progOutputFile, `

#####Input (Test Case 1)#####
3, 4, 1, 6, 3, 3, 9, 0, 0, 0

Expected Output = 
4
#####Output#####
                `);
                var outFile = 'output1.txt';
                fs.outputFileSync(spawnFile, `python3.6 ${file} > ${outFile}`);
                fs.outputFileSync(expectFile, `expect -c 'spawn sh "spawnCmd.sh"; send "3, 4, 1, 6, 3, 3, 9, 0, 0, 0\\r"; interact'`); 
                console.log(`Executing from ${path.basename(sourceFolder)}`)
                execSync(`sh "${expectFile}"`, {stdio: 'inherit'});
                
                // Case 1 output and validation if written.
                if (fs.existsSync(outFile)) {
                  const output = fs.readFileSync(outFile).toString().toUpperCase();
                  fs.appendFileSync(progOutputFile, output);
                  fs.unlinkSync(outFile);

                  // Case 1 Validation
                  var regexM = /[\s\S]*?4[\s\S]*?/;
                  var matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks1 = 2;
                  }
                }

                // Case 2.
                fs.appendFileSync(progOutputFile, `

#####Input (Test Case 2)#####
1, 2, 2, 2, 2, 3, 1, 1, 8, 2

Expected Output = 
6
#####Output#####
                `);
                fs.outputFileSync(spawnFile, `python3.6 ${file} > ${outFile}`);
                fs.outputFileSync(expectFile, `expect -c 'spawn sh "spawnCmd.sh"; send "1, 2, 2, 2, 2, 3, 1, 1, 8, 2\\r"; interact'`); 
                console.log(`Executing from ${path.basename(sourceFolder)}`)
                execSync(`sh "${expectFile}"`, {stdio: 'inherit'});
                
                // Case 1 output and validation if written.
                if (fs.existsSync(outFile)) {
                  const output = fs.readFileSync(outFile).toString().toUpperCase();
                  fs.appendFileSync(progOutputFile, output);
                  fs.unlinkSync(outFile);

                  // Case 1 Validation
                  var regexM = /[\s\S]*?6[\s\S]*?/;
                  var matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks2 = 2;
                  }
                }

                // Case 3.
                fs.appendFileSync(progOutputFile, `

#####Input (Test Case 3)#####
2, 2, 2, 2, 2, 2, 2, 2, 2	

Expected Output = 
8
#####Output#####
                `);
                fs.outputFileSync(spawnFile, `python3.6 ${file} > ${outFile}`);
                fs.outputFileSync(expectFile, `expect -c 'spawn sh "spawnCmd.sh"; send "2, 2, 2, 2, 2, 2, 2, 2, 2	\\r"; interact'`); 
                console.log(`Executing from ${path.basename(sourceFolder)}`)
                execSync(`sh "${expectFile}"`, {stdio: 'inherit'});
                
                // Case 1 output and validation if written.
                if (fs.existsSync(outFile)) {
                  const output = fs.readFileSync(outFile).toString().toUpperCase();
                  fs.appendFileSync(progOutputFile, output);
                  fs.unlinkSync(outFile);

                  // Case 1 Validation
                  var regexM = /[\s\S]*?8[\s\S]*?/;
                  var matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks3 = 3;
                  }
                }


                // Case 4.
                fs.appendFileSync(progOutputFile, `

#####Input (Test Case 4)#####
1, 2, 3, 4, 5, 6, 7, 8, 9	

Expected Output = 
0
#####Output#####
                `);
                fs.outputFileSync(spawnFile, `python3.6 ${file} > ${outFile}`);
                fs.outputFileSync(expectFile, `expect -c 'spawn sh "spawnCmd.sh"; send "1, 2, 3, 4, 5, 6, 7, 8, 9	\\r"; interact'`); 
                console.log(`Executing from ${path.basename(sourceFolder)}`)
                execSync(`sh "${expectFile}"`, {stdio: 'inherit'});
                
                // Case 1 output and validation if written.
                if (fs.existsSync(outFile)) {
                  const output = fs.readFileSync(outFile).toString().toUpperCase();
                  fs.appendFileSync(progOutputFile, output);
                  fs.unlinkSync(outFile)

                  // Case 1 Validation
                  var regexM = /[\s\S]*?0[\s\S]*?/;
                  var matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks4 = 3;
                  }
                }
                // Add cases as many we want.

                // Delete Shell Files.
                fs.unlinkSync(spawnFile);
                fs.unlinkSync(expectFile);

                var marks = out1Marks1 + out1Marks2 + out1Marks3 + out1Marks4;
            
                // Writing to the Log File, Keep Comments as you like
                const evaluationComments = `\n\nMARKS: ${marks}

COMMENTS:
        Test Case 1 Passed: +2: ${out1Marks1}
        Test Case 2 Passed: +2: ${out1Marks2}
        Test Case 3 Passed: +3: ${out1Marks3}
        Test Case 4 Passed: +3: ${out1Marks4}
        `;
                const logFile = `${folder}_${process.argv[4]}`;
                fs.outputFileSync(logFile, folder);
                fs.appendFileSync(logFile, evaluationComments);
                fs.appendFileSync(logFile, "\nWarning And Errors\n");
                fs.appendFileSync(logFile, fs.readFileSync(progOutputFile).toString());
                fs.appendFileSync(logFile, `\nEvaluated by: ${evaluator}`)
                fs.unlinkSync(progOutputFile);
            }
        });
    }
});