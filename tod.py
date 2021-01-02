import random
ch=input("Enter 1 to continue and 0 to exit \n")
names=["Chaitanaya","Daksh","Kushagra","Mudit","Parth"]
length=(len(names) -1)
prevAsk=0
ask=1
prevAns=0
ans=1
while(ch!=0):
	while((ask==ans) or (prevAns==ans) or (prevAsk==ask)):
		ask = random.randint(0,length)
		ans = random.randint(0,length)
	print(names[ask] + " asks to "+names[ans])
	prevAns=ans
	prevAsk=ask
	ch=input("Enter 1 to continue and 0 to exit \n")