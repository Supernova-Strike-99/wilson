class Solution {
public:
    bool isValid(string s) {
        stack<char> a;
        for(auto i : s){
            if(i=='{' || i=='['|| i=='(') a.push(i);
            else{
                if(a.empty()) return false;
                char t =a.top();
                if((i==')' && t!='(')||(i==']' && t!='[')||(i=='}' && t!='{') ) return false;
                a.pop();
            }
        }
        return a.empty();
    }
};