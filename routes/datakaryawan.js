var express = require("express");
var router = express.Router();
var authentication_mdl = require("../middlewares/authentication");
var session_store;
/* GET Customer page. */

router.get("/karyawan", authentication_mdl.is_login, function(req, res, next) {
    req.getConnection(function(err, connection) {
        var query = connection.query(
            "SELECT * FROM karyawan",
            function(err, rows) {
                if (err) var errornya = ("Error Selecting : %s ", err);
                req.flash("msg_error", errornya);
                res.render("karyawan/list", {
                    title: "DataKaryawan",
                    data: rows,
                    session_store: req.session,
                });
            }
        );
        //console.log(query.sql);
    });
});



router.delete(
    "/delete/(:id)",
    authentication_mdl.is_login,
    function(req, res, next) {
        req.getConnection(function(err, connection) {
            var karyawan = {
                id: req.params.id,
            };

            var delete_sql = "delete from karyawan where ?";
            req.getConnection(function(err, connection) {
                var query = connection.query(
                    delete_sql,
                    karyawan,
                    function(err, result) {
                        if (err) {
                            var errors_detail = ("Error Delete : %s ", err);
                            req.flash("msg_error", errors_detail);
                            res.redirect("/datakaryawan/karyawan");
                        } else {
                            req.flash("msg_info", "Barang Berhasil di Hapus");
                            res.redirect("/datakaryawan/karyawan");
                        }
                    }
                );
            });
        });
    }
);
router.get(
    "/edit/(:id)",
    authentication_mdl.is_login,
    function(req, res, next) {
        req.getConnection(function(err, connection) {
            var query = connection.query(
                "SELECT * FROM karyawan where id=" + req.params.id,
                function(err, rows) {
                    if (err) {
                        var errornya = ("Error Selecting : %s ", err);
                        req.flash("msg_error", errors_detail);
                        res.redirect("/datakaryawan");
                    } else {
                        if (rows.length <= 0) {
                            req.flash("msg_error", "Barang can't be find!");
                            res.redirect("/datakaryawan");
                        } else {
                            console.log(rows);
                            res.render("karyawan/edit", {
                                title: "Edit ",
                                data: rows[0],
                                session_store: req.session,
                            });
                        }
                    }
                }
            );
        });
    }
);
router.put(
    "/edit/(:id)",
    authentication_mdl.is_login,
    function(req, res, next) {
        req.assert("nama_karyawan", "Please fill the name").notEmpty();
        var errors = req.validationErrors();
        if (!errors) {
            v_nama_karyawan = req.sanitize("nama_karyawan").escape().trim();
            v_email = req.sanitize("email").escape().trim();
            v_no_hp = req.sanitize("no_hp").escape().trim();
            v_alamat = req.sanitize("alamat").escape();

            var karyawan = {
                nama_karyawan: v_nama_karyawan,
                email: v_email,
                no_hp: v_no_hp,
                alamat: v_alamat,
            };

            var update_sql = "update karyawan SET ? where id = " + req.params.id;
            req.getConnection(function(err, connection) {
                var query = connection.query(
                    update_sql,
                    karyawan,
                    function(err, result) {
                        if (err) {
                            var errors_detail = ("Error Update : %s ", err);
                            req.flash("msg_error", errors_detail);
                            res.render("karyawan/edit", {
                                nama_karyawan: req.param("nama_karyawan"),
                                email: req.param("email"),
                                no_hp: req.param("no_hp"),
                                alamat: req.param("alamat"),
                            });
                        } else {
                            req.flash("msg_info", "Barang Berhasil di Edit");
                            res.redirect("/datakaryawan/edit/" + req.params.id);
                        }
                    }
                );
            });
        } else {
            console.log(errors);
            errors_detail = "<p>Sory there are error</p><ul>";
            for (i in errors) {
                error = errors[i];
                errors_detail += "<li>" + error.msg + "</li>";
            }
            errors_detail += "</ul>";
            req.flash("msg_error", errors_detail);
            res.redirect("/datakaryawan/edit/" + req.params.id);
        }
    }
);

router.post("/add", authentication_mdl.is_login, function(req, res, next) {
    req.assert("nama_karyawan", "Tolong isi data secara lengkap").notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
        v_nama_karyawan = req.sanitize("nama_karyawan").escape().trim();
        v_email = req.sanitize("email").escape().trim();
        v_no_hp = req.sanitize("no_hp").escape().trim();
        v_alamat = req.sanitize("alamat").escape();

        var karyawan = {
            nama_karyawan: v_nama_karyawan,
            email: v_email,
            no_hp: v_no_hp,
            alamat: v_alamat,
        };

        var insert_sql = "INSERT INTO karyawan SET ?";
        req.getConnection(function(err, connection) {
            var query = connection.query(
                insert_sql,
                karyawan,
                function(err, result) {
                    if (err) {
                        var errors_detail = ("Error Insert : %s ", err);
                        req.flash("msg_error", errors_detail);
                        res.render("/karyawan/add-karyawan", {
                            nama_karyawan: req.param("nama_karyawan"),
                            email: req.param("email"),
                            no_hp: req.param("no_hp"),
                            alamat: req.param("alamat"),
                            session_store: req.session,
                        });
                    } else {
                        req.flash("msg_info", "Barang Berhasil di Tambah");
                        res.redirect("/datakaryawan/karyawan");
                    }
                }
            );
        });
    } else {
        console.log(errors);
        errors_detail = "<p>Maaf Tidak Bisa di Tambah</p><ul>";
        for (i in errors) {
            error = errors[i];
            errors_detail += "<li>" + error.msg + "</li>";
        }
        errors_detail += "</ul>";
        req.flash("msg_error", errors_detail);
        res.render("karyawan/add-karyawan", {
            nama_karyawan: req.param("nama_karyawan"),
            email: req.param("email"),
            session_store: req.session,
        });
    }
});

router.get("/add", authentication_mdl.is_login, function(req, res, next) {
    res.render("karyawan/add-karyawan", {
        title: "Add New karyawan",
        name: "",
        email: "",
        phone: "",
        address: "",
        session_store: req.session,
    });
});

module.exports = router;