'use strict';

const {Datastore} = require('@google-cloud/datastore');

// [START config]
const ds = new Datastore();

/* const ds = new Datastore({
  apiEndpoint: 'http://localhost:8081',
  projectId: 'test-octabyte'
}); */

const kind = 'ThemeAddon';
// [END config]

// Translates from Datastore's entity format to
// the format expected by the application.
//
// Datastore format:
//   {
//     key: [kind, id],
//     data: {
//       property: value
//     }
//   }
//
// Application format:
//   {
//     id: id,
//     property: value
//   }
function fromDatastore(obj) {
  obj.id = obj[Datastore.KEY].id;
  return obj;
}

// Translates from the application's format to the datastore's
// extended entity property format. It also handles marking any
// specified properties as non-indexed. Does not translate the key.
//
// Application format:
//   {
//     id: id,
//     property: value,
//     unindexedProperty: value
//   }
//
// Datastore extended format:
//   [
//     {
//       name: property,
//       value: value
//     },
//     {
//       name: unindexedProperty,
//       value: value,
//       excludeFromIndexes: true
//     }
//   ]
function toDatastore(obj, nonIndexed) {
  nonIndexed = nonIndexed || [];
  const results = [];
  Object.keys(obj).forEach(k => {
    if (obj[k] === undefined) {
      return;
    }
    results.push({
      name: k,
      value: obj[k],
      excludeFromIndexes: nonIndexed.indexOf(k) !== -1,
    });
  });
  return results;
}

// Lists all books in the Datastore sorted alphabetically by title.
// The ``limit`` argument determines the maximum amount of results to
// return per page. The ``token`` argument allows requesting additional
// pages. The callback is invoked with ``(err, books, nextPageToken)``.
// [START list]
function list(limit, token, cb) {
  const q = ds
    .createQuery([kind])
    .limit(limit)
    .order('title')
    .start(token);

  ds.runQuery(q, (err, entities, nextQuery) => {
    if (err) {
      cb(err);
      return;
    }
    const hasMore =
      nextQuery.moreResults !== Datastore.NO_MORE_RESULTS
        ? nextQuery.endCursor
        : false;
    cb(null, entities.map(fromDatastore), hasMore);
  });
}
// [END list]

// Creates a new book or updates an existing book with new data. The provided
// data is automatically translated into Datastore format. The book will be
// queued for background processing.
// [START update]
function update(name, data, cb) {
  let key;
  if (name) {
    key = ds.key([kind, name]);
  } 

  read(name, (err, readData) => {
    if(err){
      console.log(err);
      cb(err, null);
      return;
    }

    const newData = Object.assign(readData, data);
    const entity = {
      key: key,
      data: toDatastore(newData, ['description']),
    };
  
    return new Promise(resolve => {
      ds.save(entity, err => {
        data = entity.key;
        if(err){
          console.log(err);
          resolve("ERROR");
        }else{
          resolve(data);
        }
      });
    });
    

  });

  
}
// [END update]

function create(name, data, cb) {
  let key;
  if (name) {
    key = ds.key([kind, name]);
  }

  const entity = {
    key: key,
    data: toDatastore(data, ['description']),
  };

  return new Promise( resolve => {
    ds.save(entity, err => {
      data = entity.key;
      if(err){
        console.log(err);
        resolve("ERROR");
      }else{
        resolve(data);
      }
    });
  });
}

function read(name, cb) {
  const key = ds.key([kind, name]);
  return new Promise( resolve => {
    ds.get(key, (err, entity) => {
      if (!err && !entity) {
        err = {
          code: 404,
          message: 'Not found',
        };
      }
      if (err) {
        resolve("ERROR");
      }else{
        resolve(fromDatastore(entity));
      }
      
    });
  });
  
}

function _delete(name, cb) {
  const key = ds.key([kind, parseInt(name, 10)]);
  ds.delete(key, cb);
}

// [START exports]
module.exports = {
  create,
  read,
  update,
  delete: _delete,
  list,
};
// [END exports]