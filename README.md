* npx typeorm migration:create -n PostRefactoring
* npx ts-node ./node_modules/typeorm/cli.js migration:run
* npx ts-node ./node_modules/typeorm/cli.js migration:revert

* docker build -f Dockerfile.stress .
* docker run --env-file ./.env -p 8080:8080 -it <hash>