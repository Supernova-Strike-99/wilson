#include<bits/stdc++.h>
using namespace std;
int main(){
    int n,m;
    cin>>n>>m;
    for(int i=0;i<n;i++){
        for(int j=0;j<m;j++){
            if(i%2==0) cout<<"#";
            else if(j==4*i-3) cout<<"#";
            else if(i%2 && j<m-1) cout<<".";
        }
        cout<<endl;
    }
    return 0;
}