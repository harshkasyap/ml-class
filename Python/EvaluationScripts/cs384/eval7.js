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
const progOutputFile = 'out.txt';
fs.readdirSync(evalPath).map((folder) => {
    const sourceFolder = `${evalPath}/${folder}`;
    if (folder.startsWith('1701') && fs.lstatSync(sourceFolder).isDirectory()) {
        fs.readdirSync(sourceFolder).map((file) => {
            const sourceFile = `${sourceFolder}/${file}`;
            if ((path.basename(sourceFile) === progNameToEvaluate) || (path.basename(sourceFile) === `${progNameToEvaluate.split('.')[0]}l.py`)) {
                process.chdir(sourceFolder);
                const spawnFile = `${sourceFolder}/spawnCmd.sh`;
                const expectFile = `${sourceFolder}/expect.sh`;
                var marks = 0;00
                var out1Marks1 = 0;

                // Case 1.
                fs.appendFileSync(progOutputFile, `

#####Input (Test Case 1)#####
#####Output#####
                `);
                var outFile = 'output1.txt';
                fs.outputFileSync(spawnFile, `python3.6 ${file} first_half.csv room_capacity.csv > ${outFile}`);
                fs.outputFileSync(expectFile, `expect -c 'spawn sh "spawnCmd.sh"; send "\\r"; interact'`); 
                console.log(`Executing from ${path.basename(sourceFolder)}`)
                execSync(`sh "${expectFile}"`, {stdio: 'inherit'});
                
                // Case 1 output and validation if written.
                outFile = "output.txt"
                out1Marks1 = 10;
                if (fs.existsSync(outFile)) {
                  const output = fs.readFileSync(outFile).toString().toUpperCase();
                  fs.appendFileSync('/PlayGround/dst_ass/scripts/queries.csv', `/*${folder}*/,${output}`)
                  fs.appendFileSync(progOutputFile, output);
                  fs.unlinkSync(outFile);

                  out1Marks1 = 10;

                  // Case 1 Validation
                  var regexM = /[\s\S]*?3[\s\S]*?2[\s\S]*?1[\s\S]*?1[\s\S]*?/;
                  var matchR = regexM.exec(output);
                  if (matchR !== null) {
                    out1Marks1 = 10;
                  }
                }                

                // Add cases as many we want.

                // Delete Shell Files.
                fs.unlinkSync(spawnFile);
                fs.unlinkSync(expectFile);

                var marks = out1Marks1;
                if (marks === 0) {
                  marks = 7
                }

                // Writing to the Log File, Keep Comments as you like
                const evaluationComments = `\n\nMARKS: ${marks}

COMMENTS:
        Test Case 1 Passed: +10: ${out1Marks1}
        `;
                const logFile = `${folder}_${process.argv[4]}`;
                fs.outputFileSync(logFile, folder);
                fs.appendFileSync(logFile, evaluationComments);
                fs.appendFileSync(logFile, fs.readFileSync(progOutputFile).toString());
                fs.appendFileSync(logFile, `\nEvaluated by: ${evaluator}`)
                fs.unlinkSync(progOutputFile);
            }
        });
    }
});