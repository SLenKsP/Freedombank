const passport = require("passport");
const db = require("../models");

module.exports = app => {
  //POST: login
  app.post(
    "/api/login",
    passport.authenticate("local-login", {
      successReturnToOrRedirect: "/dashboard",
      failureRedirect: "/",
      failureFlash: true
    })
  );
  //POST: account creation
  app.post(
    "/api/signup",
    passport.authenticate("local-signup", {
      successReturnToOrRedirect: "/dashboard",
      failureRedirect: "/",
      failureFlash: true
    })
  );
  //creates a account
  app.post("/api/createAccount", function(req, res) {
    let create = createUniqueAccountNumber(req.body, req.user);
    setTimeout(function() {
      if (create === true) {
        res.redirect("/dashboard");
      }
    }, 200);
  });
  //sends money to another account
  app.post("/api/sendmoney", function(req, res) {
    let updatedValues;
    //person recieving the payment(sent money)
    db.Account.findOne({
      where: {
        email: req.body.receiving_email
      }
    }).then(function(data) {
      transactionData = {
        id: data.id,
        comment: req.body.comment,
        amount: req.body.amount
        // updated
      };
      console.log("-----");
      console.log(data.current_balance);
      console.log(req.body);
      updatedValues = {
        current_balance:
          parseInt(data.current_balance) + parseInt(req.body.amount)
      };
      let location = { where: { id: data.id } };
      console.log("target id " + data.id);
      console.log("new value will be " + JSON.stringify(updatedValues));
      db.Account.update(updatedValues, location).then(function(data) {
        console.log(data);
      });
      // db.transactions.create(transactionData).then(function(data){
      //   console.log('craeted transaction')
      // })
    });
    // })
    // db.transactions.create({
    //   account_id: req.user,
    //   transaction_type: req.body.transaction_type,
    //   comment: req.body.comment,
    //   amount: req.body.amount
    // }).then((result) => {
    //   res.json(result);
    //   db.Account.update({
    //     current_balance: result.updated_balance
    //   }, {
    //       where: {
    //       user_id: req.params.id
    //     }
    //   })
    // })
  });

  app.put("/api/updateaccount", function(req, res) {
    console.log(`Editing name: ${req.body.first_name}`);
    db.account
      .update(
        {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          address: req.body.address
        },
        {
          where: {
            email: req.body.email
          }
        }
      )
      .then((result) => {
        res.json(result);
        console.log(result);
      });
  });
  //logs you out
  app.get(`/logout`, (req, res) => {
    req.logout();
    res.redirect(`/`);
  });

  // app.post('/createAccount')

  // app.get("/api/user_data/:email", (req, res) => {
  //   db.User.findAll({
  //     where: {
  //       email: req.params.email
  //     }
  //   }).then(result => {
  //     res.json(result);
  //   });
  // });

  // app.post(`/api/login`, passport.authenticate(`local`, {
  //   successRedirect:'/member',
  //   failureRedirect:'/',
  //   failureFlash: true
  // }), (req, res) => {
  //   console.log(req.user)
  //   res.json(req.user)
  // });

  // app.post(`/api/signup`, (req, res) => {
  //   console.log(req.body);

  //   db.User.create({
  //     username: req.body.username,
  //     email: req.body.email,
  //     password: req.body.password
  //   })
  //     .then(user => {
  //       req.login(user, function(err) {
  //         if (err) res.status(400).json(err);
  //         res.json({ location: "/members" });
  //       });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       res.json(err);
  //     });
  // });

  // app.get(`/logout`, (req, res) => {
  //   if (!req.user) {
  //     res.json({});
  //   } else {
  //     res.json({
  //       email: req.user.email
  //       // id: req.user.id
  //     });
  //   }
  // });
  //creates a unique number and checks to see if that account number is unique
  function createUniqueAccountNumber(body, id) {
    let testNum = "";

    for (let i = 0; i < 8; i++) {
      let randomNum = Math.floor(Math.random() * 9);
      testNum = testNum + randomNum.toString();
    }
    testNum = parseInt(testNum);
    body.account_number = testNum;
    body.userId = id;
    db.Account.findOne({
      where: {
        account_number: testNum
      }
    }).then(data => {
      if (!data) {
        try {
          db.Account.create(body).then(function(db) {
            console.log("account created");
          });
        } catch {
          console.log("account creatation failed");
        }
      } else if (data) {
        createUniqueAccountNumber(body, id);
      }
    });
    return true;
  }
};
