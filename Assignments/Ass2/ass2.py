from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import math, random, operator


### Load CSV File
data = pd.read_csv("./preprocessed_BCLL.csv")
f_clmns = ['f1','f2','f3','f4','f5','f6','f7','f8','f9','f10','f11','f12','f13','f14','f15','f16','f17','f18','f19','f20','f21']

### Calculate Silhouette Scores and Store in A Dict
print ("####################################################")
silhouette_scores = {}
for index in range(10):
    noOfClusters = random.randint(1, int(math.sqrt(len(data.index))))
    clusterer = KMeans (n_clusters=noOfClusters)
    cluster_labels = clusterer.fit_predict(data[f_clmns])
    silhouette_scores[noOfClusters] = silhouette_score (data[f_clmns], cluster_labels, metric='euclidean')
    print ("Iteration {}:- No of clusters = {}, Silhouette score = {}".format(index + 1, noOfClusters, silhouette_scores[noOfClusters]))

    # Plot Cluster Centres
    kmeans_model = KMeans(n_clusters=noOfClusters).fit(data[f_clmns])
    centers = np.array(kmeans_model.cluster_centers_)
    plt.scatter(centers[:,0], centers[:,1], marker="x", color='b')
    # plt.savefig('noOfClusters_%d.png' % noOfClusters)
    plt.clf()

# Plot a Silhouette Score Graph
plt.plot(silhouette_scores.keys(), silhouette_scores.values())
plt.title('Plot for Sihouette score vs. No. of Clusters')
plt.ylabel('Silhouette Score')
plt.xlabel('No. of Clusters')
plt.savefig('silhouetteScore.png')

# Get Values in Best Cluster
best_noOfClusters = max(silhouette_scores.iteritems(), key=operator.itemgetter(1))[0]
kmeans_model = KMeans(n_clusters=best_noOfClusters).fit(data[f_clmns])
cluster_map = pd.DataFrame()
cluster_map['data_index'] = data.index.values
cluster_map['cluster'] = kmeans_model.labels_

# Write to files, objects of different clusters
for clsIndex in range(best_noOfClusters):
    f = open("cluster_"+str(clsIndex+1)+".csv","w+")
    for objIndex in cluster_map[cluster_map.cluster == clsIndex].index:
        f.write(str(data.iloc[objIndex][['Gene_Id']].Gene_Id) + "," + str(data.iloc[objIndex][['Gene_Name']].Gene_Name)+"\n")