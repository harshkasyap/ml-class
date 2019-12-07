import os, sys, time

f = open('rolls.txt', 'r')

for roll in f:
    #print(roll.strip("\n"))
    os.system("node eval6a.js ../Assignments assign06a.py log6a Harsh " + roll.strip("\n"))

