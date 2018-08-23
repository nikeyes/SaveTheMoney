# SaveTheMoney
Busca el mejor precio y ahorra dinerito  

## Exportar datos a csv  
sqlite3 -header -csv prices.db "select * from prices_history where price <> '';" > prices.csv