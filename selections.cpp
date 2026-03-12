#include<bits/stdc++.h>
using namespace std;
void swap(int* a,int* b){
    int temp=*a;
    *a=*b;
    *b=temp;
}
void ssort(vector<int>& a,int n){
    for(int i=0;i<n-1;i++){
        int min=i;
        for(int j=i+1;j<n;j++){
            if(a[j]<a[min]) min=j; 
        }
        swap(&a[i],&a[min]);
    }
}
int main(){
    int n;
    cin>>n;
    vector<int> a(n);
    for(int i=0;i<n;i++) cin>>a[i];
    ssort(a,n);
    for(int x : a) cout<<x<<" ";
    cout<<endl;
    return 0;
}