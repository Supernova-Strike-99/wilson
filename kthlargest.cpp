class Solution {
public:
    int prt(vector<int>& a,int low,int high){
        int i=low-1;
        int j=high+1;
        int pivot=a[low];
        while(true){
            do{
                i++;
            }while(a[i]<pivot);
            do{
                j--;
            }while(a[j]>pivot);
            if(i>=j) return j;
            swap(a[i],a[j]);
        }
    }
    int qselect(vector<int>& a,int l,int h,int k){
        while(l<h){
            int p=prt(a,l,h);
            if(k<=p) h=p;
            else l=p+1;
        }
        return a[l];
    }
    int findKthLargest(vector<int>& nums, int k) {
        return qselect(nums,0,nums.size()-1,nums.size()-k);
    }
};