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

rowCtr = 1
process.chdir(evalPath);
fs.readdirSync(evalPath).map((folder) => {
    const sourceFolder = `${evalPath}/${folder}`;
    flag = 0
    if (folder.startsWith('1701') && fs.lstatSync(sourceFolder) && fs.lstatSync(sourceFolder).isDirectory()) {
        fs.readdirSync(sourceFolder).map((file) => {
            const sourceFile = `${sourceFolder}/${file}`;
            console.log(`${folder}_${logFile}`)
            if (path.basename(sourceFile) === `${folder}_${logFile}`) {

              /* if (evalMoss) {
                // Integrate Moss Results If available
                integrateMossResults(sourceFile, folder);
              } */

              // Read Line With Marks to write in sheet
              let marksLine = '';
              fs.readFileSync(sourceFile).toString().split('\n').map((line) => {
                if(marksLine === '' && line.toLowerCase().indexOf('marks') > -1 ) {
                    marksLine = line;
                }
              });
              flag = 1
              const marks = marksLine.split(':')[1];
              console.log(`${folder}: ${marks}`);
              worksheet.cell(Number(rowCtr), 1).string(folder);
              worksheet.cell(Number(rowCtr), 2).string(marks);
              //worksheet.cell(Number(rowCtr), 3).string(`${folder}@iitp.ac.in`);
              //worksheet.cell(Number(rowCtr), 4).string(`/Users/harshkasyap/Desktop/Research/Evaluation/EvaluatedByHarsh_Final/Results/EndSemResult/zips/${folder}.zip`);
            }
        });
    }
    if (flag == 0) {
        worksheet.cell(Number(rowCtr), 1).string(folder);
        worksheet.cell(Number(rowCtr), 2).string('0');
    }
    rowCtr++;
});

workbook.write(`${workBookName}.xlsx`);

// find . -name "*.zip" | while read filename; do unzip -o -d "`dirname "$filename"`" "$filename"; done;
// for d in */; do cp /PlayGround/dst_ass/scripts/7.15_cm_vel_ns.csv  "$d"; done
// python3.6 assign07a.py first_half.csv room_capacity.csv
// find . -iname "*assign*7**.py" | wc -l

// 2a
// node eval2a ../Assignments/ assign02a.py log2a Harsh
// node createResult.js ../Assignments/ log2a 2a 2a
// node eval2a ../Assignments/ assign02a.py log2as Harsh
// node createResult.js ../Assignments/ log2as 2as 2as

// 2b
// node eval2b ../Assignments/ assign02b.py log2b Harsh
// node createResult.js ../Assignments/ log2b 2b 2b
// node eval2b ../Assignments/ assign02b.py log2bs Harsh
// node createResult.js ../Assignments/ log2bs 2bs 2bs

// 3a
// node eval3a ../Assignments/ assign03a.py log3a Harsh
// node createResult.js ../Assignments/ log3a 3a 3a
// node eval3a ../Assignments/ assign03a.py log3as Harsh
// node createResult.js ../Assignments/ log3as 3as 3as
// node eval3a ../Assignments/ assign03a.py log3ass Harsh
// node createResult.js ../Assignments/ log3ass 3ass 3ass

// 3b
// node eval3b ../Assignments/ assign03b.py log3b Harsh
// node createResult.js ../Assignments/ log3b 3b 3b
// node eval3b ../Assignments/ assign03b.py log3bs Harsh
// node createResult.js ../Assignments/ log3bs 3bs 3bs
// node eval3b ../Assignments/ assign03b.py log3bss Harsh
// node createResult.js ../Assignments/ log3bss 3bss 3bss

// 4a
// node eval4a ../Assignments/ assign04a.py log4a Harsh
// node createResult.js ../Assignments/ log4a 4a 4a
// node eval4a ../Assignments/ assign04a.py log4as Harsh
// node createResult.js ../Assignments/ log4as 4as 4as
// node eval4a ../Assignments/ assign04a.py log4ass Harsh
// node createResult.js ../Assignments/ log4ass 4ass 4ass
// node eval4a ../Assignments/ assign04a.py log4asss Harsh
// node createResult.js ../Assignments/ log4asss 4asss 4asss
// node eval4a ../Assignments/ assign04a.py log4assss Harsh
// node createResult.js ../Assignments/ log4assss 4assss 4assss

// 5a
// node eval5a ../Assignments/ assign05a.py log5a Harsh
// node createResult.js ../Assignments/ log5a 5a 5a

// 6a
// node eval6a ../Assignments/ assign06a.py log6a Harsh
// node createResult.js ../Assignments/ log6a 6a 6a

//8a

//node eval8.js  ../Assignments/ Assign08.py log8a Harsh
//node eval8.js  ../Assignments/ assign08.py log8a Harsh
//node eval8.js  ../Assignments/ assign08_a.py log8a Harsh
//node eval8.js  ../Assignments/ assign08a.py log8a Harsh
//node eval8.js  ../Assignments/ assign8.py log8a Harsh
// node createResult.js ../Assignments/ log8a 8a 8a

//7a
// node eval7.js  ../Assignments/ assign07a.py log7a Harsh
// node createResult.js ../Assignments/ log7a 7a 7a