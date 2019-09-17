import pandas as pd
import numpy as numpy
import scipy as scipy
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sklearn import cluster
from sklearn.decomposition import PCA 
 
def makeList(NumpyArray):
    list = [item.tolist() for item in NumpyArray]
    return list

def DBSCAN(Data, eps, minPts):
    m,n=Data.shape
    Visited=numpy.zeros(m,'int')
    Type=numpy.zeros(m)
    listOfClusters=[]
    Cluster=[]
    PointClusterNumber=numpy.zeros(m)
    PointClusterNumberIndex=1
    PointNeighbors=[]
    DistanceMatrix = scipy.spatial.distance.squareform(scipy.spatial.distance.pdist(Data, 'euclidean'))
    for i in xrange(m):
        if Visited[i]==0:
            Visited[i]=1
            PointNeighbors=numpy.where(DistanceMatrix[i]<eps)[0]
            if len(PointNeighbors)<minPts:
                Type[i]=-1
            else:
                for k in xrange(len(Cluster)):
                    Cluster.pop()
                Cluster.append(i)
                PointClusterNumber[i]=PointClusterNumberIndex    
                PointNeighbors=makeList(PointNeighbors)  
                makeCluster(Data[i], PointNeighbors, Cluster, minPts, eps, Visited, DistanceMatrix, PointClusterNumber, PointClusterNumberIndex)
                Cluster.append(PointNeighbors[:])
                listOfClusters.append(Cluster[:])
                PointClusterNumberIndex=PointClusterNumberIndex+1                
    return PointClusterNumber 

def makeCluster(PointToExapnd, PointNeighbors, Cluster, minPts, eps, Visited, DistanceMatrix, PointClusterNumber, PointClusterNumberIndex):
    Neighbors=[]
 
    for i in PointNeighbors:
        if Visited[i]==0:
            Visited[i]=1
            Neighbors=numpy.where(DistanceMatrix[i]<eps)[0]
            if len(Neighbors)>=minPts:
                for j in Neighbors:
                    try:
                        PointNeighbors.index(j)
                    except ValueError:
                        PointNeighbors.append(j)
                    
        if PointClusterNumber[i]==0:
            Cluster.append(i)
            PointClusterNumber[i]=PointClusterNumberIndex
    return

dta = pd.read_csv('diabetes3.csv')
X = dta.drop('L1', axis = 1)
pca = PCA(n_components = 2) 
X_pca = pca.fit_transform(X) 
X_pca = pd.DataFrame(X_pca) 
X_pca.columns = ['Z1', 'Z2']

num_rows, num_cols = X_pca.shape
Data = numpy.zeros(shape=(num_rows,num_cols))
for ind in X_pca.index: 
  Data[ind][0] = X_pca['Z1'][ind]
  Data[ind][1] = X_pca['Z2'][ind]

result = DBSCAN(Data,2,5)

noOfclusters = len(set(result)) - (1 if -1 in result else 0)
plt.scatter(Data[:,0],Data[:,1], c=result, cmap='Paired')
plt.title('Estimated number of clusters with eps 2 nd minPts 5: %d' % noOfclusters)
plt.savefig('DBScanPlot.png')
print("Visulaize the core and border points for clusters in the generated figure DBScanPlot.png")