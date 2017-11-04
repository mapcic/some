# Work with XML
## AXP (Application for XML parsing)
Application write on JS (es6) for parsing ***.xml** file. In app execute three tasks:
1. The number of internal links (tags *\<a href="#id"\>*)
2. The total number of letters inside the tags, not including
   white space characters (*\<aaa dd="ddd"\> text \<\/ aaa\>* - four letters)
3. Number of broken internal links (links to nonexistent element IDs)
### Setup
```shell
npm install
```
### Run
```shell
npm run server
```
### Use
```url
http://localhost:8080/?xml=/fixed.xml
```