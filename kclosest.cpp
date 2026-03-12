class Solution {
public:
    int dist(vector<int>& p){
        return p[0]*p[0]+p[1]*p[1];
    }
    int prt(vector<vector<int>>& a,int l,int h){
        int i=l-1;
        int j=h+1;
        int pivot=dist(a[l]);
        while(1){
            do{i++;}while(dist(a[i])<pivot);
            do{j--;}while(dist(a[j])>pivot);
            if(i>=j) return j;
            swap(a[i],a[j]);
        }
    }
    void qselect(vector<vector<int>>& a,int l,int h,int k){
        while(l<h){
            int p=prt(a,l,h);
            if(k<=p) h=p;
            else l=p+1;
        }
    }
    vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
        qselect(points,0,points.size()-1,k-1);
        return vector<vector<int>>(points.begin(),points.begin()+k); 
    }
};