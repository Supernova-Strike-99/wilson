#include<stdio.h>
#include<stdlib.h>
struct node {
    int data;
    struct node *next;
};
// struct node* insertathead(struct node *head,int newval) {
//     struct node* new=malloc(sizeof(struct node));
//     new->data=newval;
//
//
//
//     new->next=head;
//     return new;
// }


// struct node* insertpos(struct node *head,int val,int pos) {
//     struct node *l,*p;
//     struct node *new=malloc(sizeof(int));
//     new->data=val;
//     l=head;
//     p=NULL;
//
//     for (int i=0;l!=NULL && i<pos;i++) {
//         p=l;
//         l=l->next;
//     }
//
//     if (p==NULL) {
//         new->next=head;
//         return new;
//     }
//
//     new->next=l;
//     p->next=new;
//     return head;
// }
//
// struct node *insertend(struct node *head,int val) {
//     struct node *new=malloc(sizeof(struct node));
//     new->next=NULL;
//     new->data=val;
//     struct node *l=head;
//     if (head==NULL) return new;
//     while (l->next!=NULL) {
//         l=l->next;
//     }
//     l->next=new;
//     return head;
// }
// struct node* reverse(struct node* head) {
//     if (head==NULL || head->next==NULL) return head;
//     struct node* curr=head;
//     struct node* prev=NULL;
//     while (curr!=NULL) {
//         struct node* temp=curr->next;
//         curr->next=prev;
//         prev=curr;
//         curr=temp;
//     }
//     return prev;
// }

struct node* reverse(struct node* head,struct node* prev=NULL) {
    if (head==NULL) return prev;
    struct node* temp=head->next;
    head->next=prev;
    return reverse(temp,head); // returns the new head
}

int main() {
    struct node *a=malloc(sizeof(struct node));
    struct node *b=malloc(sizeof(struct node));
    struct node *c=malloc(sizeof(struct node));
    a->data=1;
    b->data=2;
    c->data=3;
    a->next=b;
    b->next=c;
    c->next=NULL;
    insertend(a,100);


    return 0;
}