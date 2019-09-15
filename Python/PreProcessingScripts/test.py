import xlrd 
import xlwt 
from xlwt import Workbook 

wb = xlrd.open_workbook("modifiedData.xlsx") 
sheet = wb.sheet_by_index(0) 

wbW = Workbook()
sheet1 = wbW.add_sheet('Sheet 1')

utterance = ''
response = ''

counter = 0
flag = 0
sheet1.write(0, 0, 'Utterance')
sheet1.write(0, 1, 'Response')
for i in range(sheet.nrows):
  if (sheet.cell_value(i, 2) == 0):
    if (counter > 0):
      if (response != ''):
        sheet1.write(counter, 0, utterance)
        sheet1.write(counter, 1, response)
    if (response != ''):
      counter = counter + 1
    response = ''
    if (flag):
      flag = 0
      utterance = sheet.cell_value(i, 4)
    else:
      utterance += sheet.cell_value(i, 4)
  else:
    flag = 1
    vStr = str(sheet.cell_value(i, 4))
    response += vStr

wbW.save('newParsedData.xls') 