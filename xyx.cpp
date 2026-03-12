#include <bits/stdc++.h>
using namespace std;

class Array{
    private:
        int *A;
        int s;
        int l;
        void swap(int* x,int* y);
    public:
        Array(){
            s=10;
            l=0;
            A=new int[s];
        }
        Array(int sz){
            s=sz;
            l=0;
            A=new int[s];
        }
        ~Array(){ delete []A;}

        void dis();
        void app(int x);
        void ins(int idx,int x);
        int ls(int key);
        int bs(int key); // recursive not included for now
        int get(int idx);
        void set(int idx,int x);
        int del(int idx);
        int max();
        int min();
        int sum();
        float avg();
        void r1();
        void r2();
        void insort(int x);
        int issor();
        void rearr();
        Array* mer(Array arr2);
        Array* uni(Array arr2);
        Array* intse(Array arr2);
        Array* dife(Array arr2);
};

void Array::dis(){
    for(int i;i<l;i++) cout<<A[i]<<" ";
    cout<<endl;
}
void Array::app(int x){
    if(l<s) A[l++]=x;
}
void Array::ins(int idx,int x){
    if(idx>=0 && idx<=l){
        for(int i=l;i>idx;i--) A[i]=A[i-1];
    A[idx]=x;
    l++;
    } 
}
int Array::del(int idx){
    int x=0;
    int i;

    if(idx>=0&&idx<l){
        x=A[idx];
        for(i=idx;i<l-1;i++)
            A[i]=A[i+1];
        l--;
        return x;
    }
    return 0;
}

void Array::swap(int *x, int *y){
    int temp;
    temp=*x;
    *x=*y;
    *y=temp;
}

int Array::ls(int key){
    int i;
    for (i=0;i<l;i++){
        if (key==A[i]){
            swap(&A[i],&A[0]);
            return i;
        }
    }
    return -1;
}

int Array::bs(int key){
    int l, mid, h;
    l = 0;
    h = l - 1;
    while (l <= h){
        mid = (l + h) / 2;
        if (key == A[mid])
            return mid;
        else if (key <A[mid])
            h = mid - 1;
        else
            l = mid + 1;
    }
    return -1;
}

// int Array::rbs(int a[], int l, int h, int key){
//     int mid;
//     if (l <= h)
//     {
//         mid = (l + h) / 2;
//         if (key == a[mid])
//             return mid;
//         else if (key < a[mid])
//             return rbs(a, l, mid - 1, key);
//         else
//             return rbs(a, mid + 1, h, key);
//     }
//     return -1;
// }

int Array::get(int idx){
    if (idx >= 0 && idx < l)
        return A[idx];
    return -1;
}

void Array::set(int idx, int x){
    if (idx >= 0 && idx < l)
        A[idx] = x;
}

int Array::max(){
    int mx = A[0];
    int i;
    for (i = 1; i < l; i++)
    {
        if (A[i] > mx)
            mx = A[i];
    }
    return mx;
}

int Array::min(){
    int mn = A[0];
    int i;
    for (i = 1; i < l; i++)
    {
        if (A[i] < mn)
            mn = A[i];
    }
    return mn;
}

int Array::sum(){
    int s = 0;
    int i;
    for (i = 0; i < l; i++)
        s += A[i];
    return s;
}

float Array::avg(){
    return (float)sum() / l;
}

void Array::r1(){
    int *B;
    int i, j;
    B = new int[l];
    for (i = l - 1, j = 0; i >= 0; i--, j++)
        B[j] = A[i];
    for (i = 0; i < l; i++)
        A[i] = B[i];
}

void Array::r2(){
    int i, j;
    for (i = 0, j = l - 1; i < j; i++, j--)
        swap(&A[i], &A[j]);
}

void Array::insort(int x){
    int i = l - 1;
    if (l == s)
        return;
    while (i >= 0 && A[i] > x){
        A[i + 1] = A[i];
        i--;
    }
    A[i + 1] = x;
    l++;
}

int Array::issor(){
    int i;
    for (i = 0; i < l - 1; i++){
        if (A[i] > A[i + 1])
            return 0;
    }
    return 1;
}

void Array::rearr(){
    int i = 0;
    int j = l - 1;
    while (i < j){
        while (A[i] < 0)
            i++;
        while (A[j] >= 0)
            j--;
        if (i < j)
            swap(&A[i], &A[j]);
    }
}

Array* Array::mer(Array arr2){
    int i=0,j=0,k=0;
    Array *arr3 = new Array(l+arr2.l);
    while (i < l && j < arr2.l){
        if (A[i] < arr2.A[j])
            arr3->A[k++] = A[i++];
        else
            arr3->A[k++] = arr2.A[j++];
    }
    for (; i < l; i++)
        arr3->A[k++] = A[i];
    for (; j < arr2.l; j++)
        arr3->A[k++] = arr2.A[j];
    arr3->l = l + arr2.l;
    arr3->s = 10;
    return arr3;
}

Array* Array::uni(Array arr2){
    int i, j, k;
    i = j = k = 0;
    Array* arr3=new Array(l+arr2.l);
    while (i < l && j < arr2.l){
        if (A[i] < arr2.A[j])
            arr3->A[k++] = A[i++];
        else if (arr2.A[j] < A[i])
            arr3->A[k++] = arr2.A[j++];
        else{
            arr3->A[k++] = A[i++];
            j++;
        }
    }
    for (; i < l; i++)
        arr3->A[k++] = A[i];
    for (; j < arr2.l; j++)
        arr3->A[k++] = arr2.A[j];
    arr3->l = k;
    arr3->s = 10;
    return arr3;
}

Array* Array::intse(Array arr2){
    int i, j, k;
    i = j = k = 0;
    Array *arr3 = new Array(l+arr2.l);
    while (i < l && j < arr2.l){
        if (A[i] < arr2.A[j])
            i++;
        else if (arr2.A[j] < A[i])
            j++;
        else{
            arr3->A[k++] = A[i++];
            j++;
        }
    }
    arr3->l = k;
    return arr3;
}

Array* Array::dife(Array arr2){
    int i, j, k;
    i = j = k = 0;
    Array *arr3 = new Array(l+arr2.l);
    while (i < l && j < arr2.l){
        if (A[i] < arr2.A[j])
            arr3->A[k++] = A[i++];
        else if (arr2.A[j] < A[i])
            j++;
        else{
            i++;
            j++;
        }
    }
    for (; i < l; i++)
        arr3->A[k++] = A[i];
    arr3->l = k;
    return arr3;
}
int main()
{
    Array *arr1;
    int ch,sz;
    int x,index;
    cout<<"Enter Size of Array";
    scanf("%d",&sz);
    arr1=new Array(sz);
    do
        {
        cout<<"\n\nMenu\n";
        cout<<"1. Insert\n";
        cout<<"2. Delete\n";
        cout<<"3. Search\n";
        cout<<"4. Sum\n";
        cout<<"5. Display\n";
        cout<<"6.Exit\n";
        cout<<"enter you choice ";
        cin>>ch;
        switch(ch)
    {
        case 1: cout<<"Enter an element and index ";
        cin>>x>>index;
        arr1->ins(index,x);
        break;
        case 2: cout<<"Enter index ";
        cin>>index;
        x=arr1->del(index);
        cout<<"Deleted Element is"<<x;
        break;
        case 3:cout<<"Enter element to search ";
        cin>>x;
        index=arr1->ls(x);
        cout<<"Element index "<<index;
        break;
        case 4:cout<<"Sum is "<<arr1->sum();
        break;
        case 5:arr1->dis();
    }
    }while(ch<6);
    return 0;
}