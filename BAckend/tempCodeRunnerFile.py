n=int(input())

m=n
s=0
d=1
while(n!=0):
    r=n%10
    s=s*10+r
    
    n=n//10
    
print(s)