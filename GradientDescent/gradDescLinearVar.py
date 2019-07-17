import math, time

# Check time taken to execute this code
startTime= int(round(time.time() * 1000))

trainingData = [{1: 0.5}, {2: 1}, {4: 2}, {0: 0}]
gradientValues = [{0.5: 0.5}, {1: 0.5}, {0.5: 0}, {0: 0.5}, {1: 1}, {-1: 0.5}]
gradientCost = []

for gradient in gradientValues:
    theta0 = gradient.items()[0][0]
    theta1 = gradient.items()[0][1]

    # h(theta(x)) = theta0 + theta1 * x
    hTheta = [{data.items()[0][1]: theta0 + ( theta1 * data.items()[0][0] )} for data in trainingData]

    # J(theta0, theta1) = { summation from 1 to m ( square( h ( theta ( x ) ) - y ) ) } / (2 * m)
    gradientCost.append(sum([(abs(cost.items()[0][1] - cost.items()[0][0]) ** 2) for cost in hTheta]) / (2 * len(trainingData)))

print (gradientCost)
print ("\nTime Taken To Execute " + str(int(round(time.time() * 1000)) - startTime))