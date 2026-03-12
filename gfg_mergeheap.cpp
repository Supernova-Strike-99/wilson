// User function Template for C++

class Solution {
  public:
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
    vector<int> mergeHeaps(vector<int> &a, vector<int> &b, int n, int m) {
        // your code here
        vector<int> ans(n+m);
        ans=a;
        for(int i : b) ans.push_back(i);
        buildmheap(ans,ans.size());
        return ans;
    }
};