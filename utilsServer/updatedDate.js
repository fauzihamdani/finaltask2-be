const { Transaction } = require('../models/');

exports.updatedDateTransactions = async () => {
   console.log('halo');
   try {
      console.log('halo1');
      const transactions = await Transaction.findAll();
      console.log(JSON.stringify(transactions));
      console.log('halo2');
      var lastLoginDate = Date.now();
      const ids = [];
      transactions.map((transaction) => ids.push(transaction.id));
      console.log(ids);

      await Transaction.update(
         { lastLoginDate: lastLoginDate },
         {
            where: {
               id: ids,
            },
         }
      );
   } catch (error) {}
};
