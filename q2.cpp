class Solution {
public:
    vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
        unordered_map<int, int> m;
        stack<int> s;
        for(int n : nums2) {
            while(!s.empty() && n>s.top()) {
                m[s.top()]=n;
                s.pop();
            }
            s.push(n);
        }
        vector<int> ans;
        ans.reserve(nums1.size());
        for(int n : nums1) {
            if(m.count(n)) ans.push_back(m[n]);
            else ans.push_back(-1);
        }
        return ans;
    }
};