trainingData = [1, 0.5; 2, 1; 4, 2; 0, 0];
gradientValues = [0.5, 1, 0.5, 0, 1, -1; 0.5, 0.5, 0, 0.5, 1, 0.5];
gradientCost = [];

% modify TrainingData to looklike first column with 1 and second col with value of x
modTrainingData = fliplr(trainingData);
modTrainingData( : , 1) = [1 1 1 1];

% h(theta(x)) = theta0 + theta1 * x
hThetaArr = modTrainingData * gradientValues;

% J(theta0, theta1) = { summation from 1 to m ( square( h ( theta ( x ) ) - y ) ) } / (2 * m)
for col = 1:columns(hThetaArr)
    rowGradientCost = 0;
    for row = 1:rows(hThetaArr)
        diff = (hThetaArr((col-1)*rows(hThetaArr) + row)) - trainingData(row + rows(trainingData));
        rowGradientCost = rowGradientCost + ( diff ^ 2 );
    endfor
    gradientCost = [gradientCost, rowGradientCost / (2 * rows(trainingData))];
endfor

gradientCost