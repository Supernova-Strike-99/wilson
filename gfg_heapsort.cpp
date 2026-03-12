// The functions should be written in a way that array become sorted
// in increasing order when heapSort() is called.

class Solution {
  public:
    // Function to sort an array using Heap Sort.
    void heapify(vector<int>& a,int n,int i){
        int largest=i;
        int l=2*i+2;
        int r=2*i+1;
        if(l<n && a[l]>a[largest]) largest=l;
        if(r<n && a[r]>a[largest]) largest=r;
        if(largest!=i){
            swap(a[i],a[largest]);
            heapify(a,n,largest);
        }
    }
    void buildmheap(vector<int>& a,int n){
        for(int i=n/2-1;i>=0;i--) heapify(a,n,i);
    }
    void heapSort(vector<int>& arr) {
        // code here
        int n=arr.size();
        buildmheap(arr,n);
        while(n>1){
            swap(arr[0],arr[n-1]);
            n--;
            heapify(arr,n,0);
        }
    }
};