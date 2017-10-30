#include <malloc.h>
#include <stdio.h>

int main() {
    int n;
    int v = 0; 
    char* c;

    scanf("%i", &n);

    c = (char*) malloc(4 * sizeof(char)); 
    // while (n > 9) {
    //     c[v++] = (n % 10) + '0';
    //     n = n / 10;
    // }
    // c[v++] = n + '0';
    // c[v] = '\0';
    // char t;
    // //инвертируем массив символов
    // for (int i = 0; i < v / 2; i++)
    // {
    //     t = c[i];
    //     c[i] = c[v - 1 - i];
    //     c[v - 1 - i] = t;
    // }
    // v = 0;
    while (c[v] != '\0')
        printf("%c", c[v++]);
    // printf("\n");
    // free(c);
    // return 0;

    
}