import csv

decoded_sentences = {}
train_sentences = {}
o_train_sentences = {}
output = {}
temp = {}

whitelist = set('abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ')

with open('Competitors.csv','rt')as f:
  data = csv.reader(f)
  for row in data:
    #print (row)
    row[2] = str(row[2]).strip()
    #print (row[2])
    transformed = ''.join(filter(whitelist.__contains__, row[2]))
    if row[5] in decoded_sentences:
      #print (row[5])
      decoded_sentences[row[5]].append(transformed)
    else:
      decoded_sentences[row[5]] = [] 
      decoded_sentences[row[5]].append(transformed)
      #print(decoded_sentences)

with open('competitors_train.csv','rt')as f:
  data = csv.reader(f)
  for row in data:
    #print (row)
    row[1] = str(row[1]).strip()
    #print(row[1])
    transformed = ''.join(filter(whitelist.__contains__, row[1]))
    if row[2] in train_sentences:
      o_train_sentences[row[2]].append(row[1])
      train_sentences[row[2]].append(transformed)
    else:
      o_train_sentences[row[2]] = []
      train_sentences[row[2]] = []
      o_train_sentences[row[2]].append(row[1])
      #print(o_train_sentences)
      train_sentences[row[2]].append(transformed)

def addSentCount(sent, train, o_sent):
  if sent in temp[train]:
    return
  else:
    if train in decoded_sentences:
      temp[train].append(sent)
      output[train].append({o_sent: decoded_sentences[train].count(sent)})

for train in train_sentences:
  #print(train_sentences[train])
  index = 0
  for sent in train_sentences[train]:
    #print(sent)
    o_sent = o_train_sentences[train][index]
    index = index + 1
    if train in output:
      addSentCount(sent, train, o_sent)
    else:
      output[train] = []
      temp[train] = []
      addSentCount(sent, train, o_sent)

# Get Complete dictinary
# print (output)

# Get Train Per
trainPer = []
for cat in output:
  count = 0
  index = 0
  for sent in output[cat]:
    if output[cat][index][list(output[cat][index].keys())[0]] > 0:
      count = count + 1
    index = index + 1
  trainPer.append({cat: "".join([str(count), "/", str(index)])})
#print (trainPer)


# Get Test Per
testPer = []
for cat in output:
  count = 0
  index = 0
  for sent in output[cat]:
    if output[cat][index][list(output[cat][index].keys())[0]] > 0:
      count = count + output[cat][index][list(output[cat][index].keys())[0]]
    index = index + 1
  if cat in decoded_sentences:
    testPer.append({cat: "".join([str(count), "/", str(len(decoded_sentences[cat]))])})
print (testPer)