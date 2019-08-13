import os, operator
from collections import Counter
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt


### Load SCV File
testCsvFile = "./stackOverflow.csv"
testCsvLink = "https://drive.google.com/file/d/0B1AC_DBfxZmWS0pMbWsyNUJrV083akMtVV81NmViRjcxbmhj/view"
if os.path.exists(testCsvFile):
    print ("We have the DataSet" + testCsvFile)
else:
    print ("We don't have the DataSet" + testCsvFile)
    print ("Let's Download it")
    os.system("./gdown.pl " + testCsvLink + " " + testCsvFile)
data = pd.read_csv(testCsvFile)

# Function used for Ques 5-8
def getSortedTagRateAvg(data, key, value):
    tagRate = {}
    listOfKeys = list(data[key])
    listOfValues = list(data[value])
    for index in range(len(listOfKeys)):
        for _tag in listOfKeys[index].split(","):
            try:
                tagRate[_tag].append(listOfValues[index])
            except Exception:
                tagRate[_tag] = [listOfValues[index]]
    tagRateAvg = {tag: np.average(tagRate[tag]) for tag in list(tagRate.keys())}
    sorted_tagRateAvg = sorted(tagRateAvg.items(), key=operator.itemgetter(1))
    return sorted_tagRateAvg


print ("\n########################################################################")
print ("1. Find out the no. of questions asked with respect to the given Tags.")
noOfTags = Counter([len(tag.split(',')) for tag in data['tags'].unique()])
plt.figure(figsize=(20,10))
plt.bar(list(noOfTags.keys()), list(noOfTags.values()))
plt.title('no. of questions asked with respect to the given Tags')
plt.savefig('questionsAskedWrtTags.png')
print ("Refer questionsAskedWrtTags.png for results")


print ("\n########################################################################")
print ("2. Find out the most commonly used tags and what is the trend in Data Science Tags.")
parsedTags = Counter([_tag for tag in data['tags'].unique() for _tag in tag.split(',')])
sorted_parsedTags = sorted(parsedTags.items(), key=operator.itemgetter(1))
plt.figure(figsize=(20,10))
plt.bar([pair[0] for pair in sorted_parsedTags[-10:]], [pair[1] for pair in sorted_parsedTags[-10:]])
plt.title('most commonly used tags')
plt.savefig('mostCommonlyUsedTags.png')
print ("Refer mostCommonlyUsedTags.png for results")
# Add if you can see more related terms in CSV file for better results of data science trend
expectedDataScienceTags = ['ai', 'artificial-intelligence', 'machine-learning', 'python', 'genetic-algorithms', 'classification', 'nlp', 'clustering', 'matlab']
expectedDataScienceVals = [parsedTags[key] for key in expectedDataScienceTags]
plt.figure(figsize=(20,10))
plt.bar(expectedDataScienceTags, expectedDataScienceVals)
plt.title('Data Science Trending Tags')
plt.savefig('dataScienceTrend.png')
print ("Refer dataScienceTrend.png for results")


print ("\n########################################################################")
print ("3. The average time is taken to answer a question.")
print ("Average Time taken to answer a question is " + str((data['at'] - data['qt']).mean()))


print ("\n########################################################################")
print ("4. Numbers of views related to the number of Answers.")
viewsRelatedToAnswer = data[['qvc', 'qac']].drop_duplicates()
print (viewsRelatedToAnswer.head())
print ("Infer Below Description")
print (viewsRelatedToAnswer.describe())


print ("\n########################################################################")
print ("5. Tags get highest/lowest rating in Questions.")
tagsRelatedToQuestions = data[['tags', 'qs']].drop_duplicates()
sorted_tagRateAvg = getSortedTagRateAvg(tagsRelatedToQuestions, 'tags', 'qs')
plt.figure(figsize=(20,10))
plt.bar([pair[0] for pair in sorted_tagRateAvg[-10:]], [pair[1] for pair in sorted_tagRateAvg[-10:]])
plt.title('Highest Rating Questions')
plt.savefig('highestRatingQuestions.png')
print ("Refer highestRatingQuestions.png for results")
# For lowest Rating
plt.figure(figsize=(20,10))
plt.bar([pair[0] for pair in sorted_tagRateAvg[:10]], [pair[1] for pair in sorted_tagRateAvg[:10]])
plt.title('Lowest Rating Questions')
plt.savefig('lowestRatingQuestions.png')
print ("Refer lowestRatingQuestions.png for results")


print ("\n########################################################################")
print ("6. Tags get highest/lowest rating in Answers.")
tagsRelatedToAnswers = data[['tags', 'as']].drop_duplicates()
sorted_tagRateAvg = getSortedTagRateAvg(tagsRelatedToAnswers, 'tags', 'as')
plt.figure(figsize=(20,10))
plt.bar([pair[0] for pair in sorted_tagRateAvg[-10:]], [pair[1] for pair in sorted_tagRateAvg[-10:]])
plt.title('Highest Rating Answers')
plt.savefig('highestRatingAnswers.png')
print ("Refer highestRatingAnswers.png for results")
# For lowest Rating
plt.figure(figsize=(20,10))
plt.bar([pair[0] for pair in sorted_tagRateAvg[:10]], [pair[1] for pair in sorted_tagRateAvg[:10]])
plt.title('Lowest Rating Answers')
plt.savefig('lowestRatingAnswers.png')
print ("Refer lowestRatingAnswers.png for results")


print ("\n########################################################################")
print ("7. Find out the most Active/Inactive in answering the questions.")
tagsActiveInactive = data[['tags', 'qt', 'at']].drop_duplicates()
tagsActiveInactive['diff'] = abs(tagsActiveInactive['qt'] - tagsActiveInactive['at'])
sorted_tagRateAvg = getSortedTagRateAvg(tagsActiveInactive, 'tags', 'diff')
plt.figure(figsize=(20,10))
plt.bar([pair[0] for pair in sorted_tagRateAvg[:10]], [pair[1] for pair in sorted_tagRateAvg[:10]])
plt.title('Highest Active Group')
plt.savefig('highelyActiveGroup.png')
print ("Refer highelyActiveGroup.png for results")
# For lowest Rating
plt.figure(figsize=(20,10))
plt.bar([pair[0] for pair in sorted_tagRateAvg[-10:]], [pair[1] for pair in sorted_tagRateAvg[-10:]])
plt.title('Lowest Active Group')
plt.savefig('lowestActiveGroup.png')
print ("Refer lowestActiveGroup.png for results")


print ("\n########################################################################")
print ("8. Find out the most Active/Inactive in answering the questions.")
tagsActiveInactive = data[['tags', 'qvc']].drop_duplicates()
sorted_tagRateAvg = getSortedTagRateAvg(tagsActiveInactive, 'tags', 'qvc')
plt.figure(figsize=(20,10))
plt.bar([pair[0] for pair in sorted_tagRateAvg[-10:]], [pair[1] for pair in sorted_tagRateAvg[-10:]])
plt.title('Highest Viewed Tag')
plt.savefig('highestViewedTag.png')
print ("Refer highestViewedTag.png for results")
# For lowest Rating
plt.figure(figsize=(20,10))
plt.bar([pair[0] for pair in sorted_tagRateAvg[:10]], [pair[1] for pair in sorted_tagRateAvg[:10]])
plt.title('Lowest Viewed Tag')
plt.savefig('lowestViewedTag.png')
print ("Refer lowestViewedTag.png for results")