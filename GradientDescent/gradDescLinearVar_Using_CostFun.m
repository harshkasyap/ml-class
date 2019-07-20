X = [1, 1; 1, 2; 1, 4; 1, 0];
y = [0.5; 1; 2; 0];
theta = [0.5, 1, 0.5, 0, 1, -1; 0.5, 0.5, 0, 0.5, 1, 0.5];

predictions = X*theta;
sqrErrors = (predictions-y).^2;
J = 1/(2*rows(X)) * sum(sqrErrors)

% Improving thetaJ
% thetaJ = thetaJ - alphaS, So calculate S first
% S = 1/m (summation ((hTheta - y)* X))

theta = [0.5; 1];
predictions = X*theta;
partialDer = [(predictions-y), (predictions-y)] .* X;
delta = 1/(m) * sum(partialDer);
alpha = 0.01
theta = theta - (alpha * delta');

% or, costFunction(X, y, theta)