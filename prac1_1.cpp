#include<iostream>
#include<vector>
#include<map>
#include<unordered_map>
#include<set>
#include<utility>
#include<tuple>
using namespace std;
int main(){     
    string cars1[4]; //declaration
    //declaration and initialization
    string cars2[4]={"Ferrari","BMW","Ford","Mclaren"};
    // omit array size
    string cars3[]={"BMW","Ford","Ferrari"};
    // omit elements on declaration
    string cars[5];
    cars[0]="Ferrari";
    cars[1]="Ford";
    cars[2]="BMW";
    cars[3]="Mazda";
    cars[4]="Volvo";
    // // throws an error,
    //array size is not mentioned
    // string _cars[];
    // _cars[0]="Ferrari";
    // _cars[1]="Ford";
    // _cars[2]="BMW";
    // _cars[3]="Mazda";
    // _cars[4]="Volvo";

    // indexing / accessing the elements of an array
    cout<<cars2[0]<<endl;
    cars2[1]="Mercedes";
    cout<<cars2[1]<<endl;

    // static vs dynamic arrays
    string x[3]={"L","p","n"};
    // x[3]="nkk"; // will result in an error

    // sizeof()
    int n[3]={1,2,3}; // gives the total size of the array
    cout<<sizeof(n)<<endl;
    int l=sizeof(n)/sizeof(n[0]);
    cout<<l<<endl; // gives number of elements in n

    //travesing the array
    for(int i=0;i<l;i++) cout<<n[i]<<" ";
    cout<<endl;
    for(int i:n) cout<<i<<" "; // for-each loop
    cout<<endl;

    // multi-dim arrays; 
    //declaration patterns are liek 1d arrays
    string Ax[2][3]={ // a 2d array 2 rows 3 columns
        {"a","b","c"},
        {"e","f","g"}
    };
    // if there are n-dimensions we need n-nested for loops
    // to traverse the multidim array
    
    // Vectors
    // you need to include the vector library
    // declaration is vector<type> name
    vector<string> carS;
    vector<string> _cars = {"Volvo", "BMW", "Ford", "Mazda"};
    // Print vector elements
    for (string car : _cars) cout << car << "\n";
    // just access elements like array _cars[i]

    cout<<_cars.front()<<" "; // get 1st element
    cout<<_cars.back()<<endl; // get last element

    // .at(i) also can be used (its more preferred ig)
    cout<<_cars.at(2)<<" ";
    cout<<_cars.at(0)<<endl;
    
    // .at() is better bcoz,try to access the index outside 
    // of the vector,it throws an error
    _cars.at(0)="Koenigsegg";
    cout<<_cars.at(0)<<endl;
    for(string x : _cars) cout<<x<<" ";
    cout<<endl;
    // add vector elements
    // we use the .push_back() function ,which adds 
    // an element at the end of the vector
    _cars.push_back("Honda");
    _cars.push_back("Mitsubushi");\
    for(string x : _cars) cout<<x<<" ";
    cout<<endl;

    // remove vector elements
    // .pop_back() is used to remove elements at the end
    _cars.pop_back();
    for(string x : _cars) cout<<x<<" ";
    cout<<endl;

    // use .size() function to find the number of
    // elements in a vector
    cout<<_cars.size()<<endl;

    // check if a vector is empty
    cout<<_cars.empty()<<endl;
    vector<string> xk;
    cout<<xk.empty()<<endl;

    // loop through vector
    // for each loop or normal loop
    for(int i=0;i<_cars.size();i++) cout<<_cars.at(i)<<" ";
    cout<<endl;
    for(string i:_cars) cout<<i<<" ";
    cout<<endl;

    // other vector operations
    vector<int> a={1,2,3,4,5};
    a.insert(a.begin()+1,12); // inserts 12 at position 1
    for(int i : a) cout<<i<<" ";
    cout<<endl;
    a.erase(a.begin()+3); // removes element at postion 3
    for(int i : a) cout<<i<<" ";
    cout<<endl;
    a.clear(); // removes all elements
    cout<<a.empty()<<endl;

    // assignment operator 
    vector<string> bbb;
    bbb=_cars;

    vector<int> z={1,2,3,4,5,6};
    vector<int> y={22,33,44,55};
    y.swap(z);

    for(int i : y) cout<<i<<" ";
    cout<<endl;
    for(int i : z) cout<<i<<" ";
    cout<<endl;

    // 2d vectors
    vector<vector<int>> A; // declaration
    vector<vector<int>> B{
        {1,2},
        {3,4}
    };
    // accessing elements
    int val=B[1][1];
    //size related functions
    int nrows=B.size();
    int ncols=B[0].size();
    // iterating through 2d vector, a nested loop is needed
    for(int i=0;i<nrows;i++){
        for(int j=0;j<ncols;j++) cout<<B[i][j]<<" ";
    }
    cout<<endl;




    // Maps ,need to include map library for this
    // basically like a dictionary,key/value pair
    //elements are automatically sorted in ascending order of their keys
    map<int,string> __x; // declaration
    map<int,string> r={ // declaration and initialization
        {1,"Black Freiza"},
        {2,"Goku"},
        {3,"Vegeta"}
    };
    // accessing map elements
    cout<<"Most powerful currently: "<<r[1]<<endl;
    // or
    cout<<"next most powerful is: "<<r.at(2)<<endl;
    // change values,associated with a key
    // map is storedlike {{key,value}}
    r.at(2)="Broly";
    r.at(3)="Goku";
    cout<<"Current 2nd most powerful is: "<<r.at(2)<<endl;
    //add elements
    r[4]="Vegeta";
    // or
    r.insert({5,"Gohan"});

    // elements with equal keys
    // a map cant have elements with equal keys
    r.insert({6,"Krillin"});
    r.insert({6,"Android 17"});
    // values can be equal but keys must be unique
    // only the first one will be kept

    cout<<r.size()<<endl; //the size of map
    cout<<r.empty()<<endl; //check if map is empty

    // for specific element check
    cout<<r.count(2)<<endl; // outputs 1 if exists

    // looping through maps,for each loop could be used
    //use auto keyword -> easy for compiler to 
    // identify the variable type
    for(auto x : r) cout<<x.first<<"is: "<<x.second<<" ";
    cout<<endl;
    // elements in map are soreted automatically in ascending order
    //by their key
    // reverse the order,use greater<type>
    // like: map<string,int,greater<string>> mapname
    //remove elements
    r.erase(6);
    r.clear(); // to remove all elements from map
    cout<<r.empty()<<endl;



    // unordered map
    unordered_map<int,string> num ={
        {1,"Oh..!"},
        {2,"Hello"},
        {3,"there."}
    };
    for(auto i:num) cout<<i.first<<": "<<i.second<<" ";
    cout<<endl;

    // set- automatically sorted in incr order
    // elements can be added or removed, but value of an exisiting one cannot be changed
    // cant be accessed by index ,bcoz the order is based on sorting not indexing
    set<string> _c; //declaration
    set<string> c={"Ferrari","Honda","BMW"}; //declrn , initialization
    for(string car : c) cout<<car<<" ";
    cout<<endl;
    // type of set cannot be changed after its been declared

    // sorting set in descending order,use greater<type>
    set<int,greater<int>>nums={1,4,9,2,7};
    for(int i:nums) cout<<i<<" ";
    cout<<endl;
    // the type specified in greater<type> must match with the type of elements in set
    //add/remove elements
    c.insert("Mazda");
    c.erase("Honda");

    cout<<c.size()<<endl; //for number of elements
    cout<<c.empty()<<endl; // check if set is empty
    c.clear(); //entire elements are removed
    cout<<c.empty()<<endl;

    // multiset, basically allows duplicate elements
    // supports insert(),erase(),count(),find()
    //sorted in ascending order,but can be changed to any desired order

    multiset<int> ms0; //empty multiset of integers
    multiset<int> ms1={5,3,2,2,1};
    for(auto i : ms1) cout<<i<<" "; // automatically sorted
    cout<<endl;



    // Pair - container that holds two values together
    pair<int,string> p1={1,"Max"};
    pair<int,string> p2=make_pair(1,"Max");
    pair<int,string> p3;
    p3.first=1;
    p3.second="Max";

    cout<<p1.first<<": "<<p1.second<<endl;


    //Tuples ,elements are of diff data types,elements are
    //initialized as arguments in order whcih they will be accessed

    //operations on tuple
    // get()- used to accesse the tuple values and modify them ,accepts index and tuple name as arguments to access elements
    // make_tuple()- used to assign tuple with values,values passed should be in order with the values declared in the tuple

    tuple<char,int,float> cx; //decln
    cx=make_tuple('a',10,15.5); // assigning values
    cout<<"The initial values of tuple are: "<<endl;
    cout<<get<0>(cx)<<" "<<get<1>(cx)<<" "<<get<2>(cx)<<endl;

    get<0>(cx)='b';
    get<2>(cx)=20.5;

    cout<<"The modified values of tuple are: "<<endl;
    cout<<get<0>(cx)<<" "<<get<1>(cx)<<" "<<get<2>(cx)<<endl;
    return 0;
}