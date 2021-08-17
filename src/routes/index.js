const express = require('express');
const router = express.Router();
const { authenticated } = require('../middlewares/auth');
const { uploadFile } = require('../middlewares/upload');

const {
   getUser,
   registerUser,
   deleteUser,
   login,
   getUserById,
   checkAuth,
   getUserProfile,
   updateUser,
   registerUserAdmin,
} = require('../controllers/user');

const { addArtist, getArtist } = require('../controllers/artist');
const { addMusic, getMusic } = require('../controllers/music');
const {
   addTransaction,
   getTransactions,
   updateTransaction,
   getTransactionById,
} = require('../controllers/transaction');

// user api
router.get('/users', getUser);
// router.get('/user-by-id/:id', authenticated, getUserById);
router.post('/login', login);
router.post('/register', registerUser);
router.post('/register-admin', registerUserAdmin);
// router.delete('/user/:id', authenticated, deleteUser);
// router.patch(
//    '/user/:iduser',
//    authenticated,
//    uploadFile('fileUpload'),
//    updateUser
// );
router.get('/check-auth', authenticated, checkAuth);

//  Artist
router.get('/artist', authenticated, getArtist);
router.post('/artist', authenticated, addArtist);

// //  Artist
router.post(
   '/music',
   authenticated,
   uploadFile([{ name: 'thumbnail' }, { name: 'attache' }]),
   addMusic
);
router.get('/musics', getMusic);

// Transaction
router.post(
   '/transaction',
   authenticated,
   uploadFile([{ name: 'attachment' }]),
   addTransaction
);
router.get(
   '/transactions',
   authenticated,

   getTransactions
);
router.get(
   '/transactions-by-id/:id',
   authenticated,

   getTransactionById
);
router.patch(
   '/transaction/:idTransaction',
   authenticated,

   updateTransaction
);

module.exports = router;
