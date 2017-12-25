document.addEventListener('DOMContentLoaded', function () {
  var inputFile = document.querySelector('#attachment');
  var imageMetaData = document.querySelector('#img_meta_data');
  var getFile;

  var db = new PouchDB('datacollector');
  var remoteCouch = 'http://admin:zowie234@localhost:5984/datacollector';

  var form, savedata;

  form = document.getElementById('collectionform');

  savedata = function (event) {
      var r = {};
      var getFile = inputFile.files[0];

      r._id =  new Date().toISOString();
      r.name = form.name.value;
      r.latitude = form.latitude.value;
      r.longitude = form.longitude.value;
      r._attachments = {
        "file": {
          type: getFile.type,
          data: getFile
        }
      }

      db.put(r, function (error, response) {
          if (error) {
              console.log(error);
              console.log('uh oh');
          } else if (response && response.ok) {
              console.log(response);
              console.log('data inserted.');
          }
      }).then(function () {
        return db.getAttachment('image', 'file');
      }).then(function (blob) {
        var url = URL.createObjectURL(blob);
        var img = document.createElement('img');
        img.src = url;
        document.body.appendChild(img);

        var fileSize = JSON.stringify(Math.floor(blob.size/1024));
        var contentType = JSON.stringify(blob.type);

        imageMetaData.innerText = 'Filesize: ' + fileSize + 'KB, Content-Type: ' + contentType;
      }).catch(function (err) {
        console.log(err);
      });
    //
    // IMPORTANT CODE ENDS HERE
    //
    };


/* Add the event handler */
// form.addEventListener('change', savedata, false);
form.addEventListener('submit', savedata);

var syncDom = document.getElementById('sync-wrapper');

// Initialise a sync with the remote server
function sync() {
    syncDom.setAttribute('data-sync-state', 'syncing');
    var opts = {
        live: true,
        retry: true,
    };
    db.replicate.to(remoteCouch, opts, syncError);
    db.replicate.from(remoteCouch, opts, syncError);
}

// There was some form or error syncing
function syncError() {
    syncDom.setAttribute('data-sync-state', 'error');
}

if (remoteCouch) {
    sync();
}

})
