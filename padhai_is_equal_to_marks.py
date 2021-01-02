sum = 0
a = []
print("for computer out of 100")
a.append(input())
sum+=a[0]
print("for other subjects out of 80")
for i in range(1, 10):
        a.append(input());
        a[i] = a[i] *1.25
        a[i] = round(a[i])
        sum+=a[i]
percent=sum/10
print(str(percent) + "\n\n\n" + str(sum))
