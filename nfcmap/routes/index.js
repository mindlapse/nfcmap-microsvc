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


/* GET home page. */
router.get('/newtag', function(req, res, next) {
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
    }
});

module.exports = router;
