import math, time
import numpy as np

# Check time taken to execute this code
startTime= int(round(time.time() * 1000))

trainingData = np.array([[1, 0.5], [2, 1], [4, 2], [0, 0]])
gradientValues = np.array([[0.5, 1, 0.5, 0, 1, -1], [0.5, 0.5, 0, 0.5, 1, 0.5]])
gradientCost = []

# modify TrainingData to looklike first column with 1 and second col with value of x
modTrainingData = np.zeros((4, 2), dtype = np.float)
modTrainingData[:] = trainingData[:]
# interchange columns
modTrainingData[:,[0, 1]] = modTrainingData[:,[1, 0]] 
# assign 1 to first column
modTrainingData[:, 0] = 1

# h(theta(x)) = theta0 + theta1 * x
hThetaArr = np.dot(modTrainingData, gradientValues)
hThetaArr = np.transpose(hThetaArr)

# J(theta0, theta1) = { summation from 1 to m ( square( h ( theta ( x ) ) - y ) ) } / (2 * m)
for hTheta in hThetaArr:
    thetaArr = [{trainingData[index, 1]: theta} for index, theta in enumerate(hTheta)]
    gradientCost.append(sum([math.sqrt(abs(cost.items()[0][0] - cost.items()[0][1])) for cost in thetaArr]) / (2 * len(trainingData)))

print (gradientCost)
print ("\nTime Taken To Execute " + str(int(round(time.time() * 1000)) - startTime))