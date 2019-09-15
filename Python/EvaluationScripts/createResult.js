const path = require('path');
const fs = require('fs-extra');
const excel = require('excel4node');

// Run like node createResult.js pathToFolderHavingAssignmentsResults logFileName ExcelWorkBookName ExcelSheetName mossCSVFile
// eg node createResult.js 2019_PDS assgn02.log AssignEval EEAssign2 mossCSVFile
const evalPath = path.resolve(process.argv[2]);
const logFile = process.argv[3];
const workBookName = process.argv[4];
const sheetName = process.argv[5];
const mossCSV = process.argv[6] !== undefined ? process.argv[6] : undefined;

var workbook = new excel.Workbook();
var worksheet = workbook.addWorksheet(sheetName);

let mossSourceRoll = [], mossDestRoll = [], mossPiracy = [], mossLines = [];

function integrateMossResults(sourceFile, rollNo) {
    let mossComments = 'Plagarism Report';
    mossSourceRoll.map((sourceRoll, index) => {
    if (rollNo === sourceRoll) {
        mossComments += `\n${mossLines[index]}`;
    }
    });
    mossDestRoll.map((destRoll, index) => {
    if (rollNo === destRoll) {
        mossComments += `\n${mossLines[index]}`;
    }
    });

    if (mossComments !== 'Plagarism Report') {
        let logString = fs.readFileSync(sourceFile).toString();
        logString = logString.replace(/Plagarism Report[\s\S]*=============================================\n/, '');
        logString = logString.replace(/MARKS:[\s\S]*?[0-9]+/, 'MARKS: 0');
        mossComments += '\n=============================================\n';
        fs.writeFileSync(sourceFile, mossComments);
        fs.appendFileSync(sourceFile, logString);
    }
}

function processMossResults() {
    fs.readFileSync(mossCSV).toString().split('\n').map((line) => {
        const splitArr = line.split(',');
        console.log(line);
        if (splitArr.length == 3 && (Number)(splitArr[0].split('(')[1].split('%')[0]) > 90 && (Number)(splitArr[1].split('(')[1].split('%')[0]) > 90) {
            console.log(line);
            mossSourceRoll.push(splitArr[0].split('/')[1]);
            mossDestRoll.push(splitArr[1].split('/')[1]);
            mossPiracy.push(splitArr[0].split('(')[1].split('%')[0]);
            mossLines.push(line);
        }
    });
}

let evalMoss = false;
if (fs.existsSync(mossCSV)) {
    evalMoss = true;
    processMossResults();
}

process.chdir(evalPath);
fs.readdirSync(evalPath).map((folder) => {
    const sourceFolder = `${evalPath}/${folder}`;
    if (folder.startsWith('1801CS') && fs.lstatSync(sourceFolder) && fs.lstatSync(sourceFolder).isDirectory()) {
        fs.readdirSync(sourceFolder).map((file) => {
            const sourceFile = `${sourceFolder}/${file}`;
            if (path.basename(sourceFile) === `${folder}_${logFile}`) {
              
              if (evalMoss) {
                // Integrate Moss Results If available
                integrateMossResults(sourceFile, folder);
              }

              // Read Line With Marks to write in sheet
              let marksLine = '';
              fs.readFileSync(sourceFile).toString().split('\n').map((line) => {
                if(marksLine === '' && line.toLowerCase().indexOf('marks') > -1 ) {
                    marksLine = line;
                }
              });
              
              const marks = marksLine.split(':')[1];
              console.log(`${folder}: ${marks}`);
              worksheet.cell(Number(folder.substring(6)), 1).string(folder);
              worksheet.cell(Number(folder.substring(6)), 2).string(marks);
              worksheet.cell(Number(folder.substring(6)), 3).string(`${folder}@iitp.ac.in`);
              worksheet.cell(Number(folder.substring(6)), 4).string(`/Users/harshkasyap/Desktop/Research/Evaluation/EvaluatedByHarsh_Final/Results/EndSemResult/zips/${folder}.zip`);
            }
        });
    }
});

workbook.write(`${workBookName}.xlsx`);