var mysql = require('mysql');
var express = require('express');
var router = express.Router();

var pool = mysql.createPool({
  connectionLimit : 5,
  host            : 'localhost',
  database        : 'nfcMap',
  user            : 'mushketera',
  password        : 'mushketera'
});

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

/* GET home page. */
router.get('/newtag', function(req, res, next) {

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
    }
  });
});

module.exports = router;
