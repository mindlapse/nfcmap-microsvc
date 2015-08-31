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
            c.release();
            res.render('newtag', response);
          });
        });
      } catch (e) {
        c.release();
        console.dir(e);
        res.status(500).send(e);
      }
    } else {
      console.dir(err);
    }
  });
});

module.exports = router;
