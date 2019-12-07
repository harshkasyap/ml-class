f = open('EE.txt' , "r")

st = set()
for x in f:
    strr = x.strip("\n")[0:5]
    if 'EE' in strr:
        st.add(strr)

strrr = ''
for item in st:
    strrr += item + ","

print (strrr)