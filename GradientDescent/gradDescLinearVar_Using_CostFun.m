X = [1, 1; 1, 2; 1, 4; 1, 0];
y = [0.5; 1; 2; 0];
theta = [0.5, 1, 0.5, 0, 1, -1; 0.5, 0.5, 0, 0.5, 1, 0.5];

predictions = X*theta;
sqrErrors = (predictions-y).^2;
J = 1/(2*rows(X)) * sum(sqrErrors)

% or, costFunction(X, y, theta)