This project was create for Computer Project in ITU.

First start master with 
  - cd Master 
  - npm start
Then start as many storage slaves as you want with
  - cd Storage
  - npm start

Then go into Client
  - cd Client

  you can directly do RPC with command line
  - node index.js [method] [path] [flag or data] [local file path if flag]

  flag must be '-f' to use local files.
  methods can be [read, write, getAttr, delete].
  In read if -f is set, the output will be written to local file.
  In write if -f is set, the data will be read from local file.