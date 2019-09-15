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

                var out1Marks = 0, out1Marks1 = 0, out1Marks2 = 0, out1Marks3 = 0, out1Marks4 = 0, out1Marks5 = 0, out1Marks6 = 0,deduct = 0;

                // Case 1.
                fs.appendFileSync(progOutputFile, `

#####Input (Test Case 1)#####
================================================================
Enter 1st matrix rows, cols, ELEMENTS: 3 3 10 20 30 40 50 60 70 80 90 (Here 3 rows, 3 cols, and 9 elements)
Enter 2nd matrix rows, cols, ELEMENTS: 3 3 11 22 33 44 55 66 77 88 99 (Here 3 rows, 3 cols, and 9 elements)
Enter 3rd matrix rows, cols, ELEMENTS (for determinant and inverse): 3 3 21 31 41 51 61 71 81 91 101
(Here 3 rows, 3 cols, and 9 elements)

Expected Output = 
addition of two matrix:
21	42	63	
84	105	126	
147	168	189	

subraction of two matrix:
-1	-2	-3	
-4	-5	-6	
-7	-8	-9	

multiplication of two matrix:
3300	3960	4620	
7260	8910	10560	
11220	13860	16500	

transpose of both matrix:
10 40 70 
20 50 80 
30 60 90 

11 44 77 
22 55 88 
33 66 99 	

Determinant of A Matrix. If the matrix is not square,
print on the screen that the determinant cannot be computed.
0

6.) Inverse of A Matrix
Inverse can't be calculated
#####Output#####
                `); 
                fs.outputFileSync(spawnFile, `gcc ${file} > error.txt 2>&1 -o execObject -lm && ./execObject > output1.txt`);
                fs.outputFileSync(expectFile, `expect -c 'spawn sh "spawnCmd.sh"; send "3 3 10 20 30 40 50 60 70 80 90\\r 3 3 11 22 33 44 55 66 77 88 99\\r 3 3 21 31 41 51 61 71 81 91 101\\r";interact'`); 
                console.log(`Executing from ${path.basename(sourceFolder)}`)
                execSync(`sh "${expectFile}"`, {stdio: 'inherit'});
                
                // Case 1 output and validation if written.
                if (fs.existsSync('output1.txt')) {
                  const output = fs.readFileSync('output1.txt').toString().toLowerCase();
                  fs.appendFileSync(progOutputFile, output);

                  // Case 1 Validation
                  var regexM = /[\s\S]*?21[\s\S]*?42[\s\S]*?63[\s\S]*?84[\s\S]*?105[\s\S]*?126[\s\S]*?147[\s\S]*?168[\s\S]*?189[\s\S]*?/;
                  var matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks1 = 2;
                  }

                  regexM = /[\s\S]*?-1[\s\S]*?-2[\s\S]*?-3[\s\S]*?-4[\s\S]*?-5[\s\S]*?-6[\s\S]*?-7[\s\S]*?-8[\s\S]*?-9[\s\S]*?/;
                  matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks2 = 2;
                  }

                  regexM = /[\s\S]*?3300[\s\S]*?3960[\s\S]*?4620[\s\S]*?7260[\s\S]*?8910[\s\S]*?10560[\s\S]*?11220[\s\S]*?13860[\s\S]*?16500[\s\S]*?/;
                  matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks3 = 2;
                  }
                  
                  regexM = /[\s\S]*?10[\s\S]*?40[\s\S]*?70[\s\S]*?20[\s\S]*?50[\s\S]*?80[\s\S]*?30[\s\S]*?60[\s\S]*?90[\s\S]*?11[\s\S]*?44[\s\S]*?77[\s\S]*?22[\s\S]*?55[\s\S]*?88[\s\S]*?33[\s\S]*?66[\s\S]*?99[\s\S]*?/;
                  matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks4 = 2;
                  }

                  regexM = /[\s\S]*?determinant[\s\S]*?0[\s\S]*?/;
                  matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks5 = 1;
                  }
                  
                  regexM = /[\s\S]*?inverse[\s\S]*?not[\s\S]*?/;
                  matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks6 = 1;
                  }                  
                }
                // Add cases as many we want.

                // Delete Shell Files.
                fs.unlinkSync(spawnFile);
                fs.unlinkSync(expectFile);

                var out1Marks = out1Marks1 + out1Marks2 + out1Marks3 + out1Marks4 + out1Marks5 + out1Marks6;
                var totalPoints = out1Marks;
                if (totalPoints > 0) {
                    marks += totalPoints;
                    // for late submission only
                    if (progNameToEvaluate === 'missedl.c') {
                      deduct = marks / 4;
                    }
                    marks -= deduct;
                }
            
                // Writing to the Log File, Keep Comments as you like
                const evaluationComments = `\n\nMARKS: ${marks}

COMMENTS:
        Marks deducted due to late Submission: ${deduct}
        Test Case 1 Passed: +10(2+2+2+2+1+1): ${out1Marks}
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