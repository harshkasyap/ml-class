degVal = [0:0.01:0.98];

sinGraph = sin(2*pi*4*degVal);

cosGraph = cos(2*pi*4*degVal);

plot(degVal, sinGraph)
hold on;
subplot(3,3,1)
plot(degVal, cosGraph, 'r')
xlabel('time')
ylabel('value')
title('plot')

A = magic(5);
subplot(3,3,2)
imagesc(A)

subplot(3,3,3)
imagesc(A), colorbar, colormap gray

print -dpng 'sincCos.png'