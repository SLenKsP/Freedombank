const passport = require('passport')
const db = require("../models");

module.exports = app => {
    //POST: login 
    app.post('/api/login', passport.authenticate('local-login',{
      successReturnToOrRedirect: '/dashboard',
      failureRedirect: '/',
      failureFlash:true
    }))
    //POST: account creation
    app.post('/api/signup',passport.authenticate('local-signup',{
      successReturnToOrRedirect: '/dashboard',
      failureRedirect: '/',
      failureFlash: true 
    }))
    //creates a account
    app.post('/api/createAccount',function(req,res){
      let create =  createUniqueAccountNumber(req.body,req.user)
      setTimeout(function(){
         if(create === true){
           res.redirect('/dashboard')
         }
      }, 200);
    })
    //sends money to another account
    app.post('/api/sendmoney',function(req,res){
      //person receiving the payment(sent money)
      db.Account.findOne({
        where: {
          email: req.body.receiving_email
        },
      }).then(function(data){
        let transactionData = {
          account_id: data.id,
          transaction_type: 'Wire-Transfer',
          comment: req.body.comment,
          amount: req.body.amount
        }
        let updatedValues = {current_balance: (parseInt(data.current_balance) + parseInt(req.body.amount))}
        let location = {where:{id:data.id}}
        db.Account.update(updatedValues,location).then()
        db.transactions.create(transactionData).then()
      })
      //person sending the money
      db.Account.findOne({
        where:{
          UserId:req.user
        }
      }).then(function(data){
        let transactionData = {
          account_id: data.id,
          transaction_type: 'Wire-Transfer',
          comment: req.body.comment,
          amount: (parseInt(req.body.amount) * -1) 
        }
        let updatedValues = {current_balance: (parseInt(data.current_balance) - parseInt(req.body.amount))}
        let location = {where: {UserId: req.user}}
        db.Account.update(updatedValues,location).then()
        db.transactions.create(transactionData).then(
          res.redirect('/dashboard')
        )
      })
    })
    //make a deposit
    app.post('/api/deposit',function(req,res){
      db.Account.findOne({
        where: {
          UserId: req.user
        }
      }).then(function(data){
        let transactionData = {
          account_id: data.id,
          transaction_type: 'Deposit',
          comment: 'Deposit',
          amount: parseInt(req.body.deposit)
        }
        let updatedValues = {current_balance:(parseInt(data.current_balance) + parseInt(req.body.deposit))}
        let location = {where: {UserId:req.user}}
        db.Account.update(updatedValues, location).then()
        db.transactions.create(transactionData).then(
          res.redirect('/dashboard')
        );
      })
    })
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
    function createUniqueAccountNumber(body,id){
      let testNum = ''

      for(let i = 0; i < 8; i++){
        let randomNum = Math.floor(Math.random() * 9)
        testNum = testNum + randomNum.toString()
      }
      testNum = parseInt(testNum)
      body.account_number = testNum
      body.userId = id
      db.Account.findOne({
        where: {
          account_number: testNum
        }
      }).then(data =>{
        if(!data){
          try{
            db.Account.create(body).then(function(db){
              console.log('account created')
            })
          } catch {
            console.log('account creatation failed')
          }
        } else if(data){
          createUniqueAccountNumber(body,id)
        }
      })
      return true
    }
};
