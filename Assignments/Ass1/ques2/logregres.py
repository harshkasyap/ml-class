# -*- coding: utf-8 -*-
"""
Created on Thu Aug 22 15:47:04 2019

@author: IITP
"""

import math, os

import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix
from sklearn.metrics import roc_curve

testCsvFile = "./data.csv"
testCsvLink = "https://drive.google.com/file/d/0B1AC_DBfxZmWS0pMbWsyNUJrV083akMtVV81NmViRjcxbmhj/view"
if os.path.exists(testCsvFile):
    print ("We have the DataSet" + testCsvFile)
else:
    print ("We don't have the DataSet" + testCsvFile)
    print ("Let's Download it")
    os.system("./gdown.pl " + testCsvLink + " " + testCsvFile)
dta = pd.read_csv(testCsvFile)

# dta=pd.read_csv('https://drive.google.com/file/d/0B1AC_DBfxZmWNkZ2QXVSVnVRbXQzVldQNFJsTnloRVlvN0Rv/view?usp=sharing')
dta.head(10)

# print the number of persons from the dataframe
print("Number of persons tested for diabetics:" +str(len(dta.index)))

sns.countplot(x="Diabetic",data=dta)

dta.isnull().sum()

X=dta.drop("Diabetic",axis=1)
y=dta["Diabetic"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=1)

# instantiate model
logreg = LogisticRegression()

logreg.fit(X_train, y_train)

predictions = logreg.predict(X_test)

accuracy_score(y_test, predictions)

# print the first 10 predicted responses
# 1D array (vector) of binary values (0, 1)
logreg.predict(X_test)[0:20]

# print the first 10 predicted probabilities of class membership
logreg.predict_proba(X_test)[0:20]

# print the first 10 predicted probabilities for class 1
logreg.predict_proba(X_test)[0:20, 1]

# store the predicted probabilities for class 1
y_pred_prob = logreg.predict_proba(X_test)[:, 1]

#histogram of predicted probabilities

# 8 bins
plt.clf()
plt.hist(y_pred_prob)

# x-axis limit from 0 to 1
plt.xlim(0,1)
plt.title("Histogram of predicted probabilities")
plt.xlabel('Predicted probability of diabetes')
plt.ylabel('Frequency')
plt.savefig('PredictedProbalities.png')

# examine the class distribution of the testing set (using a Pandas Series method)
y_test.value_counts()

# calculate the percentage of ones
# because y_test only contains ones and zeros, we can simply calculate the mean = percentage of ones
y_test.mean()

# calculate the percentage of zeros
1 - y_test.mean()

# print the first 25 true and predicted responses
print('True:', y_test.values[0:25])
print('False:', predictions[0:25])

# save confusion matrix and slice into four pieces
confusion = confusion_matrix(y_test, predictions)
print(confusion)
#[row, column]
TP = confusion[1, 1]
TN = confusion[0, 0]
FP = confusion[0, 1]
FN = confusion[1, 0]

# use float to perform true division, not integer division
print((TP + TN) / float(TP + TN + FP + FN))

classification_error = (FP + FN) / float(TP + TN + FP + FN)

print(classification_error)

sensitivity = TP / float(FN + TP)

print(sensitivity)

specificity = TN / (TN + FP)

print(specificity)

precision = TP / float(TP + FP)

print(precision)

fpr, tpr, thresholds = roc_curve(y_test, y_pred_prob)

plt.clf()
plt.plot(fpr, tpr)
plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.0])
plt.rcParams['font.size'] = 12
plt.title('ROC curve for diabetes classifier')
plt.xlabel('False Positive Rate (1 - Specificity)')
plt.ylabel('True Positive Rate (Sensitivity)')
plt.grid(True)
plt.savefig('DiabitiesClassifier.png')

# define a function that accepts a threshold and prints sensitivity and specificity
def evaluate_threshold(threshold):
    print('Sensitivity:', tpr[thresholds > threshold][-1])
    print('Specificity:', 1 - fpr[thresholds > threshold][-1])

print ('Sensitivity And Specificity For 0.5')
evaluate_threshold(0.5)
print ('Sensitivity And Specificity For 0.2')
evaluate_threshold(0.2)
print ('Sensitivity And Specificity For 0.21')
evaluate_threshold(0.21)
print ('Sensitivity And Specificity For 0.19')
evaluate_threshold(0.19)
print ('Sensitivity And Specificity For 0.1')
evaluate_threshold(0.1)
print ('Sensitivity And Specificity For 0.15')
evaluate_threshold(0.15)
print ('Sensitivity And Specificity For 0.17')
evaluate_threshold(0.17)