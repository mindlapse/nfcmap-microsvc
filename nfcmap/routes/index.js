var mysql = require('mysql');
var express = require('express');
var router = express.Router();

var pool = mysql.createPool({
    connectionLimit : 20,
    host            : 'localhost',
    database        : 'nfcMap',
    user            : 'mushketera',
    password        : 'mushketera'
});

<<<<<<< HEAD
function go(method) {
    pool.getConnection(function(err, c) {
        console.log("Connection obtained");
        if (!err) {
            try {
                method(c);
                c.release();
                console.log("Connection released");
                return null;

            } catch (e) {
                console.dir(e);
                c.release();
                return e;
            }
        } else {
            console.dir(err);
            c.release();
            return err;
        }
    });
}

function wrap(fn) {
    return function(err, result) {
        if (err) throw err;
        fn(result);
    }
}

var nfcTag = {
    loadAll : function(c, onComplete) {
        c.query("select tagId, redirectURL from nfcTag order by tagId", wrap(function(results) {
            onComplete(results);
        }));
    }
};

=======
function sendError(c, res, errorObj) {
  if (c) c.release();
  console.log("Error received :");
  console.dir(errorObj);
  res.status(500).send(errorObj);
}

function renderPage(c, res, page, binds) {
  if (c) c.release();
  res.render(page, binds);
}

function respond(c, res, json) {
  if (c) c.release();
  res.send(json);
}

/**
 * Sets the redirectURL for a tag, given the tagId and redirectURL to set.
 *
 * POST body example:
 * {
 *   tagId : "JnU9MmKa",
 *   redirectURL : "http://..."
 * }
 */
router.post('/api/savetag', function(req, res) {

  var params = req.body;

  pool.getConnection(function(err, c) {
    if (!err) {
      try {
        c.query("update nfcTag set redirectURL = ? where tagId = ?",
            [params.redirectURL, params.tagId],
            function(err, results) {
              if (err) return sendError(c, res, err);
              return respond(c, res, { ok : true });
            });
      } catch (e) {
        return sendError(c, res, e);
      }
    }
  });
});

/**
 * A page where the tags can be edited.
 */
router.get('/user/tagEditor', function(req, res, next) {
  // TODO
});
>>>>>>> 0197a9eff09fe04d02e01cc977ea643878e8f246

/* GET home page. */
router.get('/newtag', function(req, res, next) {

<<<<<<< HEAD
    var err = go(function(c) {
        c.query('insert into nfcTag (tagId, redirectURL) values (left(to_base64(md5(uuid())), 8), null)', wrap(function(result) {
            c.query('select tagId from nfcTag where id = ?', [result.insertId], wrap(function(results) {
                var response = results[0];
                response.host = req.headers.host;
                res.render('newtag', response);
            }));
        }));
    });
    if (err) {
        res.status(500).send(err);
    }
});

router.get('/admin', function(req, res) {
    go(function(c) {
        nfcTag.loadAll(c, function (results) {
            console.dir(results);
            res.render("admin", {status: "", tags: results});
        })
    });
});

router.post('/setRedirect', function(req, res) {
    if (req.body.redirectURL) {

        go(function(c) {
            c.query("update nfcTag set redirectURL = concat(?, tagId)", [req.body.redirectURL + '?tagId='], wrap(function() {
                nfcTag.loadAll(c, function(results) {
                    console.dir(results);
                    res.render("admin", {status : "Updated", tags : results});
                })
            }));
        });

    } else {
        res.status(500).send({message : "The required parameter 'redirectURL' is missing."});
=======
  pool.getConnection(function(err, c) {
    if (!err) {
      try {
        c.query('insert into nfcTag (tagId, redirectURL) values (to_base64(md5(uuid())), null)', function (err, result) {
          if (err) throw err;
          c.query('select tagId from nfcTag where id = ?', [result.insertId], function (err, results) {
            if (err) throw err;
            var response = results[0];
            response.host = req.headers.host;
            return renderPage(c, res, 'newtag', response);
          });
        });
      } catch (e) {
        return sendError(c, res, e);
      }
    } else {
      return sendError(null, res, e);
>>>>>>> 0197a9eff09fe04d02e01cc977ea643878e8f246
    }
});

module.exports = router;
