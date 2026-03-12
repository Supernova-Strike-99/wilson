#include<bits/stdc++.h>
using namespace std;
// long long f(long long n);
// long double ep(long double m,long long n);
// long double ts(long long m,long long n);

// long long f(long long n){
//     if(n==0) return 1;
//     return n*f(n-1);
// }
// long double ep(long double m,long long n){
//     if(!n) return 1;
//     if(!(n%2)) return ep(m*m,n/2);
//     else return m*ep(m*m,(n-1)/2);
// }

// long double ts(long double m,long long n){
//     if(n==0) return 1;
//     return ts(m,n-1)+ep(m,n)/f(n);
// }

// long double hts(long double m,long long n){
//     static long double s=1;
//     if(!n) return s;
//     s=1+(m/n)*s;
//     return hts(m,n-1);
// }

// int main(){
//     // long double ex=1;
//     long double x;
//     long long y;
//     cin>>x>>y;
//     // for(long long i=y;i>=1;i--){
//     //     ex=1+(x/i)*ex;
//     // }
//         cout << fixed << setprecision(25) << hts(x,y);
//     // cout << fixed << setprecision(25) << ex;
//     return 0;
// }                                        

// long long F[50];
// long long f(long long n){
//     if(n==0 || n==1) return n;
//     return f(n-1)+f(n-2);
// }
// long long _f(long long n){
//     int t0=0,t1=1,sf,i;
//     if(n==0 || n==1) return n;
//     for(i=2;i<=n;i++){
//         sf=t0+t1;
//         t0=t1;
//         t1=sf;
//     }
//     return sf;

// }
// long long __f(long long n){
//     if(n<=1){
//         F[n]=n;
//         return n;
//     }
//     else{
//         if(F[n-2]==-1) F[n-2]=f(n-2);
//         if(F[n-1]==-1) F[n-1]=f(n-1);
//         return F[n-2]+F[n-1];
//     }
// }

// long C(long n,long r){
//     if(r==n || 0==r) return 1;
//     return C(n-1,r)+C(n-1,r-1);
// }


// int main(){
//     long n,r;
//     cin>>n>>r;
//     cout<<C(n,r);
//     return 0;
// }


void TOH(int n,int A,int B,int C){
    if(n>0){
        TOH(n-1,A,C,B);
        cout<<"From "<<A<<" to "<<C<<endl;
        TOH(n-1,B,A,C);
    }
}
int main(){
    TOH(3,1,2,3);
    return 0;
}