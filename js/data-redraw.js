(function () {
  var form
    var syncDom = document.getElementById('sync-wrapper');

    var db = new PouchDB('datacollector');
    var remoteCouch = 'http://admin:zowie234@localhost:5984/datacollector';

    db.changes({
        since: 'now',
        live: true,
    }).on('change', showData);

    function showData() {
        db.allDocs({include_docs: true, descending: true}).then(function (doc) {
            redrawDataUI(doc.rows);
        }).catch(function (err) {
            console.log(err);
        });
    }

    function redrawDataUI(rs) {
        var ul = document.getElementById('data-list');
        ul.innerHTML = '';
        rs.forEach(function (r) {
            ul.appendChild(createDataListItem(r.doc));
        });
    }

    function createDataListItem(r) {
        var label = document.createElement('label');
        label.appendChild(document.createTextNode('NAME: ' + r.name));
        label.appendChild(document.createElement("br"));
        label.appendChild(document.createTextNode('LATITUDE: ' + r.latitude));
        label.appendChild(document.createElement("br"));
        label.appendChild(document.createTextNode('LONGITUDE ' + r.longitude));
        label.appendChild(document.createElement("br"));
        label.id = r._id;
        label.className = 'returndata';

        var li = document.createElement('li');
        li.id = 'li_' + r._id;
        li.appendChild(label);

        return li;
    }

    function sync() {
        syncDom.setAttribute('data-sync-state', 'syncing');
        var opts = {live: true};
        db.replicate.to(remoteCouch, opts, syncError);
        db.replicate.from(remoteCouch, opts, syncError);
    }

    function syncError() {
        syncDom.setAttribute('data-sync-state', 'error');
    }

    if (remoteCouch) {
        sync();
    }

    showData();

    var classname = document.getElementsByClassName('returndata');
    var myFunction = function () {
        // var r = {};
        //
        // r.name = form.name.value;
        console.log('It Worked');
        //r is not defined error
        // console.log('NAME: ' + r.name);
    };

    for (var i = 0; i < classname.length; i++) {
        classname[i].addEventListener('click', myFunction, false);
    }
})();
