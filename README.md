```
 _   _               _       ____  ____    ___   _   _ 
| | | |  __ _   ___ | | __  / ___||  _ \  / _ \ | \ | |
| |_| | / _` | / __|| |/ / | |  _ | |_) || | | ||  \| |
|  _  || (_| || (__ |   <  | |_| ||  __/ | |_| || |\  |
|_| |_| \__,_| \___||_|\_\  \____||_|     \___/ |_| \_|
```

# Hack GPON

Based on just-the-docs theme:
- [GitHub](https://github.com/just-the-docs/just-the-docs) 
- [Demo](https://just-the-docs.github.io/just-the-docs/)


if you want to contribute there is something to be done:

- a unique template for all sticks
- how to use arduino as TTL/UART adapter
- theoretical information on GPON
- absent stick information
- quick start
- absent and new ont

##  How to build
This website uses typescript, so remember to:

- Install node (20)
- Run npm ci to install all relevant typescript packages
- Run npm run build to transpile ts to js

Alternatively, you can just run:
`docker-compose up -d typescript` which will build all the required typescript files for you