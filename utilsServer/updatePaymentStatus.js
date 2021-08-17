const { Transaction } = require('../models/');

exports.updatedPaymentStatus = async () => {
   const transactions = await Transaction.findAll();

   // calculation remaining days
   const daysRemain = (startDate, dueDate) => {
      const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      const firstDate = new Date(startDate);
      const secondDate = new Date(dueDate);
      const diffDays = Math.round((secondDate - firstDate) / oneDay);
      return diffDays < 0 ? 0 : diffDays;
   };

   transactions.map(async (transaction) => {
      const resultDaysremain = daysRemain(
         transaction.lastLoginDate,
         transaction.dueDate
      );

      if (resultDaysremain === 7) {
         await Transaction.update(
            { payment_status: 'Cancel' },
            {
               where: {
                  id: transaction.id,
               },
            }
         );
      }
   });
};
