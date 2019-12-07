import os, sys, time

f = open('rolls.txt', 'r')

m = open('9.txt', 'r')

strr = ''
for i in m:
    strr += i

o = open ('9m.csv', 'a+')

for roll in f:
    roll = roll.strip('\n')
    if roll in strr:
        o.write(roll + ",10\n")
    else:
        o.write(roll + ",0\n")

