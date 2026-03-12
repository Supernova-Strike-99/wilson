#include<bits/stdc++.h>
using namespace std;
// void insert(int* H,int n){
//     int i=n,temp=H[i];
//     while(i>1 && temp>H[i/2]){
//         H[i]=H[i/2];
//         i/=2;
//     }
//     H[i]=temp;
// }
// int del(int* H,int n){
//     int i,j;
//     int val=H[1];
//     H[1]=H[n];
//     H[n]=val;
//     i=1;j=i<<1;
//     while(j<n-1){
//         if(H[j+1]>H[j]) j++;
//         if(H[j]>H[i]){
//             int temp=H[i];
//             H[i]=H[j];
//             H[j]=temp;
//             i=j;
//             j<<=1;
//         }
//         else break;
//     }
//     return val;
// }
// int main(){
//     int H[]={0,10,20,30,25,5,40,35}; // 40,25,35,10,5,20,30
//     for(int i=2;i<8;i++){
//         insert(H,i);
//     }
//     for(int i=7;i>1;i--){
//         del(H,i);
//     }
//     for(int i=1;i<8;i++) cout<<H[i]<<" ";
//     cout<<endl;
//     return 0;
// }
void heapify(vector<int>& a,int n,int i){
    int l=2*i+1;
    int r=2*i+2;
    int largest=i;
    if(l<n && a[l]>a[largest]) largest=l;
    if(r<n && a[r]>a[largest]) largest=r;
    if(largest!=i){
        swap(a[largest],a[i]);
        heapify(a,n,largest);
    }
}
void prt(vector<int>& a,int n){
    for(int i=0;i<n;i++) cout<<a[i]<<" ";
    cout<<endl;
}
void heaps(vector<int>& a){
    int n=a.size();
    for(int i=n/2-1;i>=0;i--) heapify(a,n,i);   // build max heap
    for(int i=n-1;i>0;i--){
        swap(a[0],a[i]);
        heapify(a,i,0);
    }
}
int main(){
    vector<int> arr={4,10,3,5,1};
    heaps(arr);
    prt(arr,arr.size());
    return 0;
}