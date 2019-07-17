import os, sys, time

startTime = int(round(time.time() * 1000))

print (" ###Output With Time Measurement\n\n")

os.system("python " + sys.argv[1])

print ("\n\n Time Taken to run this code in millis: " + str(int(round(time.time() * 1000))-startTime))