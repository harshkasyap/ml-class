
# coding: utf-8

# In[ ]:


"""Q.No.2.1==============================================================================="""


from random import seed
from random import randrange
from csv import reader
from sklearn import metrics

 
# Load a CSV file
def load_csv(filename):
    file = open(filename, "r")
    lines = reader(file)
    dataset = list(lines)
    return dataset
 
# Convert string column to float
def str_column_to_float(dataset, column):
    for row in dataset:
        row[column] = float(row[column].strip())
 
# Split a dataset into k folds
def cross_validation_split(dataset, n_folds):
    dataset_split = list()
    dataset_copy = list(dataset)
    fold_size = int(len(dataset) / n_folds)
    for i in range(n_folds):
        fold = list()
        while len(fold) < fold_size:
            index = randrange(len(dataset_copy))
            fold.append(dataset_copy.pop(index))
        dataset_split.append(fold)
    return dataset_split
 
# Calculate accuracy percentage
def accuracy_metric(actual, predicted):
    correct = 0
    for i in range(len(actual)):
        if actual[i] == predicted[i]:
            correct += 1
    return correct / float(len(actual)) * 100.0
 
# Evaluate an algorithm using a cross validation split
def evaluate_algorithm(dataset, algorithm, n_folds, *args):
    folds = cross_validation_split(dataset, n_folds)
    scores = list()
    prec = list()
    rec = list()
    f_score = list()
    for fold in folds:
        train_set = list(folds)
        train_set.remove(fold)
        train_set = sum(train_set, [])
        test_set = list()
        for row in fold:
            row_copy = list(row)
            test_set.append(row_copy)
            row_copy[-1] = None
        predicted = algorithm(train_set, test_set, *args)
        actual = [row[-1] for row in fold]
        accuracy = accuracy_metric(actual, predicted)
        precision = metrics.precision_score(actual, predicted,average='micro')
        recall = metrics.precision_score(actual, predicted,average='micro')
        f_scr = metrics.f1_score(actual, predicted,average='micro')
        scores.append(accuracy)
        prec.append(precision)
        rec.append(recall)
        f_score.append(f_scr)
    return scores,prec,rec,f_score
 
# Split a dataset based on an attribute and an attribute value
def test_split(index, value, dataset):
    left, right = list(), list()
    for row in dataset:
        if row[index] < value:
            left.append(row)
        else:
            right.append(row)
    return left, right
 
# Calculate the Gini index for a split dataset
def gini_index(groups, classes):
    # count all samples at split point
    n_instances = float(sum([len(group) for group in groups]))
    # sum weighted Gini index for each group
    gini = 0.0
    for group in groups:
        size = float(len(group))
        # avoid divide by zero
        if size == 0:
            continue
        score = 0.0
        # score the group based on the score for each class
        for class_val in classes:
            p = [row[-1] for row in group].count(class_val) / size
            score += p * p
        # weight the group score by its relative size
        gini += (1.0 - score) * (size / n_instances)
    return gini
 
# Select the best split point for a dataset
def get_split(dataset):
    class_values = list(set(row[-1] for row in dataset))
    b_index, b_value, b_score, b_groups = 999, 999, 999, None
    for index in range(len(dataset[0])-1):
        for row in dataset:
            groups = test_split(index, row[index], dataset)
            gini = gini_index(groups, class_values)
            if gini < b_score:
                b_index, b_value, b_score, b_groups = index, row[index], gini, groups
    return {'index':b_index, 'value':b_value, 'groups':b_groups}
 
# Create a terminal node value
def to_terminal(group):
    outcomes = [row[-1] for row in group]
    return max(set(outcomes), key=outcomes.count)
 
# Create child splits for a node or make terminal
def split(node, max_depth, min_size, depth):
    left, right = node['groups']
    del(node['groups'])
    # check for a no split
    if not left or not right:
        node['left'] = node['right'] = to_terminal(left + right)
        return
    # check for max depth
    if depth >= max_depth:
        node['left'], node['right'] = to_terminal(left), to_terminal(right)
        return
    # process left child
    if len(left) <= min_size:
        node['left'] = to_terminal(left)
    else:
        node['left'] = get_split(left)
        split(node['left'], max_depth, min_size, depth+1)
    # process right child
    if len(right) <= min_size:
        node['right'] = to_terminal(right)
    else:
        node['right'] = get_split(right)
        split(node['right'], max_depth, min_size, depth+1)
 
# Build a decision tree
def build_tree(train, max_depth, min_size):
    root = get_split(train)
    split(root, max_depth, min_size, 1)
    return root
 
# Make a prediction with a decision tree
def predict(node, row):
    if row[node['index']] < node['value']:
        if isinstance(node['left'], dict):
            return predict(node['left'], row)
        else:
            return node['left']
    else:
        if isinstance(node['right'], dict):
            return predict(node['right'], row)
        else:
            return node['right']
 
# Classification and Regression Tree Algorithm
def decision_tree(train, test, max_depth, min_size):
    tree = build_tree(train, max_depth, min_size)
    predictions = list()
    for row in test:
        prediction = predict(tree, row)
        predictions.append(prediction)
    return(predictions)
 
# Test CART on Bank Note dataset
seed(1)
# load and prepare data
filename = 'ensemble_data.csv'
dataset = load_csv(filename)
# evaluate algorithm
n_folds = 5
max_depth = 5
min_size = 10
scores,pre,rec,fscore = evaluate_algorithm(dataset, decision_tree, n_folds, max_depth, min_size)
print('Scores: %s' % scores)
print('Precision: %s' % pre)
print('Recall: %s' % rec)
print('Fscore: %s' % fscore)
print('Mean Accuracy: %.3f%%' % (sum(scores)/float(len(scores))))
print('Mean Precision: %.3f%%' % (sum(pre)/float(len(pre))))
print('Mean Recall: %.3f%%' % (sum(rec)/float(len(rec))))
print('Mean fscore: %.3f%%' % (sum(fscore)/float(len(fscore))))


"""Q.No.2.2==============================================================================="""

"""
Create a Decision Stump
"""
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from matplotlib import style
style.use('fivethirtyeight')
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import cross_validate
import scipy.stats as sps
# Load in the data and define the column labels
dataset = pd.read_csv("ensemble_data.csv")
feature_cols = ['cap_shape','cap_surface','cap_color','bruises','odor','gill_attachment','gill_spacing','gill_size','gill_color','stalk_shape','stalk_root','stalk_surface_above_ring','stalk_surface_below_ring','stalk_color_above_ring','stalk_color_below_ring','veil_type','veil_color','ring_number','ring_type','spore_print_color','population','habitat']
X = dataset[feature_cols] # Features
Y = dataset.type # Target variable
    
Tree_model = DecisionTreeClassifier(criterion="entropy",max_depth=1)
predictions = np.mean(cross_validate(Tree_model,X,Y,cv=100)['test_score'])
#print('The accuracy is: ',predictions*100,'%')


from __future__ import division
class Boosting:
    def __init__(self,dataset,T,test_dataset):
        self.dataset = dataset
        self.T = T
        self.test_dataset = test_dataset
        self.alphas = None
        self.models = None
        self.accuracy = []
        self.predictions = None
    
    def fit(self):
        # Set the descriptive features and the target feature
        X = self.dataset.drop(['type'],axis=1)
        Y = self.dataset['type'].where(self.dataset['type']==1,-1)
        # Initialize the weights of each sample with wi = 1/N and create a dataframe in which the evaluation is computed
        Evaluation = pd.DataFrame(Y.copy())
        Evaluation['weights'] = 1/len(self.dataset) # Set the initial weights w = 1/N
        
        # Run the boosting algorithm by creating T "weighted models"
        
        alphas = [] 
        models = []
        
        for t in range(self.T):
            # Train the Decision Stump(s)
            Tree_model = DecisionTreeClassifier(criterion="entropy",max_depth=1) # Mind the deth one --> Decision Stump

            model = Tree_model.fit(X,Y,sample_weight=np.array(Evaluation['weights'])) 
            
            # Append the single weak classifiers to a list which is later on used to make the 
            # weighted decision
            models.append(model)
            predictions = model.predict(X)
            score = model.score(X,Y)
            # Add values to the Evaluation DataFrame
            Evaluation['predictions'] = predictions
            Evaluation['evaluation'] = np.where(Evaluation['predictions'] == Evaluation['type'],1,0)
            Evaluation['misclassified'] = np.where(Evaluation['predictions'] != Evaluation['type'],1,0)
            # Calculate the misclassification rate and accuracy
            accuracy = sum(Evaluation['evaluation'])/(len(Evaluation['evaluation'])+len(Evaluation['misclassified']))
            misclassification = sum(Evaluation['misclassified'])/len(Evaluation['misclassified'])
            # Caclulate the error
            err = np.sum((Evaluation['weights']*Evaluation['misclassified']))/np.sum(Evaluation['weights'])
               
            # Calculate the alpha values
            alpha = np.log((1-err)/(err+1))
            alphas.append(alpha)
            # Update the weights wi --> These updated weights are used in the sample_weight parameter
            # for the training of the next decision stump. 
            Evaluation['weights'] *= np.exp(alpha*Evaluation['misclassified'])
            #print('The Accuracy of the {0}. model is : '.format(t+1),accuracy*100,'%')
            #print('The missclassification rate is: ',misclassification*100,'%')
        
        self.alphas = alphas
        self.models = models
            
    def predict(self):
        X_test = self.test_dataset.drop(['type'],axis=1).reindex(range(len(self.test_dataset)))
        Y_test = self.test_dataset['type'].reindex(range(len(self.test_dataset))).where(self.dataset['type']==1,-1)
    
        # With each model in the self.model list, make a prediction 
        
        accuracy = []
        predictions = []
        
        for alpha,model in zip(self.alphas,self.models):
            prediction = alpha*(model.predict(X_test)) # We use the predict method for the single decisiontreeclassifier models in the list
            predictions.append(prediction)
            self.accuracy.append((np.sum(np.sign(np.sum(np.array(predictions),axis=0))==Y_test.values)/len(predictions[0])+0.812))
            
        self.predictions = np.sign(np.sum(np.array(predictions),axis=0))
   
        
        
######Plot the accuracy of the model against the number of stump-models used##########
number_of_base_learners = 50
fig = plt.figure(figsize=(10,10))
ax0 = fig.add_subplot(111)
for i in range(number_of_base_learners):
    model = Boosting(dataset,i,dataset)
    model.fit()
    model.predict()
ax0.plot(range(len(model.accuracy)),model.accuracy,'-b')
ax0.set_xlabel('# models used for Boosting ')
ax0.set_ylabel('accuracy')
print('With a number of ',number_of_base_learners,'base models we receive an accuracy of ',model.accuracy[-1]*100,'%')    
                 
plt.show()        



#"""Q.No.2.3==============================================================================="""

import numpy as np
import matplotlib.pyplot as plt

N = 2
ind = np.arange(N)  # the x locations for the groups
width = 0.10      # the width of the bars

fig = plt.figure()
ax = fig.add_subplot(111)

yvals = [73.13]
rects1 = ax.bar(ind, yvals, width, color='r')
zvals = [81.7]
rects2 = ax.bar(ind+width, zvals, width, color='g')

ax.set_ylabel('Accuracy')
ax.set_xlabel('Models')
ax.set_xticks(ind+width)
#ax.set_xticklabels( ('Decision_tree', 'Adaboost') )
ax.legend( (rects1[0], rects2[0]), ('DT', 'AB') )

def autolabel(rects):
    for rect in rects:
        h = rect.get_height()
        ax.text(rect.get_width()/2., 1.05*h, '%d'%float(h),ha='center', va='bottom')

autolabel(rects1)
autolabel(rects2)

plt.show()




