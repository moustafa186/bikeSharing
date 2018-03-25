# Bike Sharing Platform
Smart contract for bike sharing platform.


## The smart contract has the following functions and events:

### functions
1. rentBike
2. endRent


### events
1. lock
2. unock



# How the project was initialized
1. download & unbox tutorialtoken truffle box:
```
mkdir tutorialtoken
cd tutorialtoken
truffle unbox tutorialtoken
```

2. initialize git repo for bike sharing project
```
mkdir bikesharing
cd bikesharing
git init
git remote add origin https://github.com/moustafa186/bikesharing.git
```

3. add README.md and .gitignore files
```
touch README.md
touch .gitignore
```

4. copy tutorialtoken files to bikesharing
```
cp -R tutorialtoken/ bikesharing
```

5. install zeppelin-solidity
```
npm install zeppelin-solidity
```


6. all files for initial commit & push
```
git add .
git commit -m 'Initial commit'
git push -u origin master
```

