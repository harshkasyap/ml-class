import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sklearn.cluster import DBSCAN
from sklearn.datasets.samples_generator import make_blobs
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import normalize 
from sklearn.decomposition import PCA 

dta = pd.read_csv('diabetes3.csv')
X = dta.drop('L1', axis = 1)
# or, X = dta[['f1','f2','f3','f4','f5','f6','f7','f8']] 
# or, X = dta.iloc[:,[0,1,2,3,4,5,6,7]].values
# this takes only two columns but we need to pick 8 columns, X = dta.iloc[:,[0,8]].values
# Other Train/Test Data
# centers = [[1, 1], [-1, -1], [1, -1]]
# X, labels_true = make_blobs(n_samples=750, centers=centers, cluster_std=0.4, random_state=0)

# Some Other Pre-processing Techniques
# X_scale = StandardScaler().fit_transform(X)
# X_norm = normalize(X_scale) 
# X_norm = pd.DataFrame(X_norm)

pca = PCA(n_components = 2) 
X_pca = pca.fit_transform(X) 
X_pca = pd.DataFrame(X_pca) 
X_pca.columns = ['Z1', 'Z2'] 
print(X_pca.head()) 

db = DBSCAN(eps=2, min_samples=5).fit(X_pca)
pred = db.fit_predict(X_pca)
labels = db.labels_ 
noOfclusters = len(set(labels)) - (1 if -1 in labels else 0)
#print(labels)
print("The number of clusters through DBSCAN is:", noOfclusters)     

plt.scatter(X_pca['Z1'], X_pca['Z2'], c=pred, cmap='Paired')
plt.title('Estimated number of clusters: %d' % noOfclusters)
plt.savefig('DBScanPlot.png')
print("Visulaize the core and border points for clusters in the generated figure DBScanPlot.png")