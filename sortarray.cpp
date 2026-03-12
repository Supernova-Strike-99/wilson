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
    void qsort(vector<int>& a,int low,int high){
        if(low<high){
            int p=prt(a,low,high);
            qsort(a,low,p);
            qsort(a,p+1,high);
        }

    }
    vector<int> sortArray(vector<int>& nums) {
        qsort(nums,0,nums.size()-1);
        return nums;
    }
};