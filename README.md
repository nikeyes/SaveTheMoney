# SaveTheMoney
Busca el mejor precio y ahorra dinerito  

## Exportar datos a csv  
sqlite3 -header -csv prices.db "select * from prices_history where price <> '';" > prices.csv

## Openshift commands  
- Download CLI: help -> Command Line Tools  
- oc login https://api.starter-us-east-1.openshift.com --token=<hidden>  
- oc status    
- oc get pods --selector app=save-the-money  
- oc rsh <pod-name> -> para abrir consola interactiva  
- oc rsync <pod-name>:/remote/dir/filename ./local/dir -> para descargar ficheros  
- oc rsync ./local/dir <pod-name>:/remote/dir --exclude=* --include=<file-name> --no-perms  