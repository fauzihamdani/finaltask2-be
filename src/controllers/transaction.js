const { User, Transaction } = require('../../models/');

exports.addTransaction = async (req, res) => {
   try {
      // Check if isAdmin-=-=-=-=-=-=-=-
      const { id } = req.user;
      // console.log(id);
      // const validateAdmin = await User.findOne({ where: { id: id } });

      // if (validateAdmin.isAdmin === false) {
      //    return res.send({
      //       status: 'failed',
      //       message: 'You have no authorization to do this',
      //    });
      // }
      // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      //
      //
      // prepared some variable / value in order to save data into transaction table
      console.log('hitting add transaction');
      const { body } = req;
      console.log('response body', body);
      var startDate = new Date();
      var dueDate = new Date();
      dueDate = dueDate.setDate(dueDate.getDate() + 30);
      // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      //
      //
      // check if the userid is exist in user table-=-=--=-=-
      const checkIsUserExist = await User.findOne({
         where: { id: id },
      });

      if (!checkIsUserExist) {
         return res.send({
            status: 'failed',
            message: 'Id doesnt exist',
         });
      }
      // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      //
      //
      // check if the userid is exist in tansaction table-=-=--=-=-
      const checkTransaction = await Transaction.findAll({
         where: { userId: id },
      });
      const asPremiumUser = checkTransaction.length;
      console.log(
         '==========================>',
         checkTransaction[asPremiumUser - 1]
      );
      if (checkTransaction[asPremiumUser - 1].payment_status === 'Approved') {
         console.log('User Already registered as a premium user');
         return res.send({
            status: 'failed',
            message: 'You Have been Already registered as a premium user',
         });
      }
      // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      //
      //
      // create data into Transaction Table=-=-=-=-=-
      const transaction = await Transaction.create({
         attachment: req.files.attachment[0].filename,
         startDate: startDate,
         lastLoginDate: startDate,
         dueDate: dueDate,
         user_status: 'Inactive',
         payment_status: 'Pending',
         userId: req.user.id,
      });
      // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      //
      //
      res.send({
         status: 'success',
         data: {
            transaction: transaction,
         },
      });
   } catch (error) {
      console.log(error);
   }
};

exports.getTransactions = async (req, res) => {
   try {
      console.log('hi!');
      const { id } = req.user;
      console.log(id);
      const validateAdmin = await User.findOne({
         where: { id: id },
      });

      if (validateAdmin.isAdmin === false) {
         return res.send({
            status: 'failed',
            message: 'You have no authorization to do this',
         });
      }

      const transactions = await Transaction.findAll({
         include: [
            {
               model: User,
               attributes: {
                  exclude: ['createdAt', 'updatedAt', 'password'],
               },
               as: 'user',
            },
         ],
      });

      // calculation remaining days
      const daysRemain = (startDate, dueDate) => {
         const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
         const firstDate = new Date(startDate);
         const secondDate = new Date(dueDate);
         const diffDays = Math.round((secondDate - firstDate) / oneDay);
         return diffDays < 0 ? 0 : diffDays;
      };

      const transactionsFinal = transactions.map((transaction) => ({
         id: transaction.id,
         attachment: transaction.attachment,
         startDate: transaction.startDate,
         lastLoginDate: transaction.lastLoginDate,
         dueDate: transaction.dueDate,
         user_status: transaction.user_status,
         payment_status: transaction.payment_status,
         action: transaction.action,
         userId: transaction.userId,
         daysRemaining: daysRemain(
            transaction.lastLoginDate,
            transaction.dueDate
         ),
         user: transaction.user,
      }));
      res.send({
         status: 'success',
         data: {
            transactions: transactionsFinal,
         },
      });
   } catch (error) {}
};

exports.updateTransaction = async (req, res) => {
   const { body } = req;
   const { idTransaction } = req.params;
   console.log('body================>|||', req.body, idTransaction);
   const validateAdmin = await User.findOne({ where: { id: req.user.id } });

   if (validateAdmin.isAdmin === false) {
      return res.send({
         status: 'failed',
         message: 'You have no authorization to do this',
      });
   }
   try {
      const checkId = await Transaction.findOne({
         where: {
            id: idTransaction,
         },
      });
      if (!checkId) {
         return res.send({
            status: 'failed',
            message: `Transaction id not Found`,
         });
      }

      const updatedUser = await Transaction.update(body, {
         where: {
            id: idTransaction,
         },
      });

      const findUpdatedUser = await User.findOne({
         where: { id: updatedUser },
         attributes: { exclude: ['password'] },
      });

      res.send({
         status: 'success',
         message: 'User Succesfully updated',
         data: {
            findUpdatedUser,
         },
      });
   } catch (err) {
      console.log(err);
      res.status(500).send({
         status: 'error',
         message: 'Server Error',
      });
   }
};

exports.getTransactionById = async (req, res) => {
   // Validate isAdmin =-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
   //
   //
   const { id } = req.params;
   // const { body } = req;
   // const { idTransaction } = req.params;
   // console.log('body================>|||', req.body, idTransaction);
   // const validateAdmin = await User.findOne({ where: { id: req.user.id } });
   // if (validateAdmin.isAdmin === false) {
   //    return res.send({
   //       status: 'failed',
   //       message: 'You have no authorization to do this',
   //    });
   // }
   //
   //
   //  =-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= =-=-=-=-=--=-=-=
   const transactions = await Transaction.findAll({
      where: { userId: id },
      include: [
         {
            model: User,
            attributes: {
               exclude: ['createdAt', 'updatedAt', 'password'],
            },
            as: 'user',
         },
      ],
   });
   const transactionsLength = transactions.length;
   res.send({
      status: 'success',
      message: 'User Succesfully updated',
      data: {
         transactions: transactions[transactionsLength - 1],
      },
   });
};
