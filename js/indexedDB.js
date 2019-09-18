function openDataBase() {
    return new Promise((resolve, reject) => {
        let dbReq = indexedDB.open('spacetea-client', 1);
        dbReq.onupgradeneeded = function (event) {
            // Set the db variable to our database so we can use it!  
            db = event.target.result;
            let objectStore = db.createObjectStore('jogos', { autoIncrement: true, keyPath: 'id' });
            objectStore.createIndex('id', 'id', { unique: true });
            let objectStoreAluno = db.createObjectStore('aluno', { autoIncrement: true, keyPath: 'codigo' });
            objectStoreAluno.createIndex('codigo', 'codigo', { unique: true });
            return resolve(db);
        }
        dbReq.onsuccess = function (event) {
            db = event.target.result;
            return resolve(db);
        }
        dbReq.onerror = function (event) {
            alert('error opening database ' + event.target.errorCode);
            return reject(event);
        }
    })
}

