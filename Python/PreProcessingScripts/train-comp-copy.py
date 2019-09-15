import csv
from dictlist import Dictlist

decoded_sentences = Dictlist()
train_sentences = Dictlist()
output = Dictlist()

whitelist = set('abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ')

with open('Competitors.csv','rt')as f:
  for row in csv.reader(f):
    decoded_sentences[row[5]] = ''.join(filter(whitelist.__contains__, str(row[2]).strip()))

with open('competitors_train.csv','rt')as f:
  for row in csv.reader(f):
    train_sentences[row[2]] = ''.join(filter(whitelist.__contains__, str(row[1]).strip()))

for cat in train_sentences:
  for sent in list(set(train_sentences[cat])):
    output[cat] = {sent: decoded_sentences.get(cat, []).count(sent)}

# Get Complete dictinary
print (output)

# Get Train Per
trainPer = [{cat: "".join([str(len([dict for dict in output[cat] if dict[dict.keys()[0]] > 0])), "/", str(len(output[cat]))])} for cat in output]
print("\n\n\nTrain Percentage\n")
print (trainPer)

# Get Test Per
testPer = [{cat: "".join([str(sum([dict[dict.keys()[0]] for dict in output[cat]])), "/", str(len(decoded_sentences[cat]))])} for cat in output if cat in decoded_sentences]
print("\n\n\nTest Percentage\n")
print (testPer)