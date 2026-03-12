#include<bits/stdc++.h>
using namespace std;
int lomuto(vector<int>& a,int l,int h){
    int pivot=a[h];
    int i=l-1,j=l;
    for(;j<h;j++){
        if(a[j]<=pivot){
            i++;
            swap(a[i],a[j]);
        }
    }
    swap(a[i+1],a[h]);
    return i+1;
}
int hoare(vector<int>& a,int l,int h){
    int pivot=a[l];
    int i=l-1,j=h+1;
    while(true){
        do{i++;}while(a[i]<pivot);
        do{j--;}while(a[j]>pivot);
        if(i>=j)return j;
        swap(a[i],a[j]);
    }
}
void quicksrt(vector<int>& a,int l,int h){
    if(l<h){
        int p=lomuto(a,l,h);
        quicksrt(a,l,p-1);
        quicksrt(a,p+1,h);
}
}
int quickslt(vector<int>& a,int l,int h,int k){
    // if(l==h) return a[l];
    // int i=l+rand() %(h-l+1);
    // swap(a[i],a[h]);
    // int p=lomuto(a,l,h);
    // if(k==p+1) return a[p];
    // else if(k<p) quickslt(a,l,p-1,k);
    // else quickslt(a,p+1,h,k);
    while (l < h) {
        int i = l + rand() % (h - l + 1);
        swap(a[i], a[h]);
        
        int p = partition(a, l, h);
        
        if (k == p + 1)     return a[p];
        else if (k < p + 1) h = p - 1;
        else                l = p + 1;
    }
    return a[l]
}
void prt(vector<int>& a){
    for(int i:a) cout<<i<<" ";
    cout<<endl;
}
int main(){
    vector<int> a={2,8,1,7,3,9};
    quicksrt(a,0,a.size()-1);
    prt(a);
    return 0;
}