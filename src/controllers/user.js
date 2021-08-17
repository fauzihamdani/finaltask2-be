const { User } = require('../../models/');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');

exports.getUser = async (req, res) => {
   try {
      const users = await User.findAll();

      res.send({
         status: 'success',
         data: {
            users: users,
         },
      });
   } catch (error) {
      console.log(error);
      res.status(500).send({
         status: 'error',
         message: 'server error',
      });
   }
};

exports.registerUser = async (req, res) => {
   try {
      const { body } = req;
      const { email, name, username, password, bio, image } = body;

      // console.log('serveruser', req.body);

      const schema = Joi.object({
         email: Joi.string().email().min(3).max(50).required(),
         password: Joi.string().min(3).max(100).required(),
         fullname: Joi.string().min(3).max(50).required(),
         password: Joi.string().min(3).max(50).required(),
         gender: Joi.string().min(3).max(50).required(),
         phone: Joi.string().min(3).max(50).required(),
         address: Joi.string().min(3).max(50).required(),
         isAdmin: Joi.boolean().required(),
      });
      console.log('tes here');
      const { error } = schema.validate(req.body);

      if (error)
         return res.status(400).send({
            status: 'validation failed',
            message: error.details[0].message,
         });

      const checkEmail = await User.findOne({
         where: {
            email: req.body.email,
         },
      });
      console.log(req.body);
      if (checkEmail)
         return res.status(400).send({
            status: 'Register failed',
            message: 'Email already registered',
         });

      const hashStrength = 10;
      const hashedPassword = await bcrypt.hash(req.body.password, hashStrength);

      const user = await User.create({
         email: req.body.email,
         fullname: req.body.fullname,
         password: hashedPassword,
         listAs: '0',
         gender: req.body.gender,
         phone: req.body.phone,
         address: req.body.address,
         isAdmin: req.body.isAdmin,
         subcribe: '',
         photoprofile: 'photo-pp.jpg',
      });
      console.log('tes here');
      const secretKey = process.env.SECRET_KEY;
      const token = jwt.sign(
         {
            id: user.id,
         },
         secretKey
      );
      console.log(token);
      res.send({
         status: 'success',
         message: 'User Succesfully Registered',
         data: {
            user: {
               email: user.email,
               name: user.name,
               token,
            },
         },
      });
   } catch (err) {
      console.log(err);
      res.status(500).send({
         status: 'error',
         message: err,
      });
   }
};

exports.login = async (req, res) => {
   try {
      const { email, password } = req.body;

      console.log('hitting login');

      const schema = Joi.object({
         email: Joi.string().email().min(5).max(50).required(),
         password: Joi.string().min(4).required(),
      });

      const { error } = schema.validate(req.body);

      if (error)
         return res.status(400).send({
            status: 'validation failed',
            message: error.details[0].message,
         });

      const checkEmail = await User.findOne({
         where: {
            email,
         },
      });

      if (!checkEmail)
         return res.status(400).send({
            status: 'Login Failed',
            message: 'Your Credentials is not Valid',
         });

      const isValidPass = await bcrypt.compare(password, checkEmail.password);

      if (!isValidPass) {
         return res.status(400).send({
            status: 'Login Failed',
            message: 'Your Credentials is not Valid',
         });
      }

      const secretKey = process.env.SECRET_KEY;
      const token = jwt.sign(
         {
            id: checkEmail.id,
         },
         secretKey
      );

      res.send({
         status: 'success',
         message: 'Login Success',
         data: {
            user: {
               id: checkEmail.id,
               name: checkEmail.name,
               email: checkEmail.email,
               token,
            },
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

exports.deleteUser = async (req, res) => {
   try {
      const { id } = req.params;
      const newUser = await User.destroy({ where: { id } });

      if (id !== req.userId.id) {
         return res.status(400).send({
            status: 'Action Failed',
            message: 'Your Credentials is not Valid',
         });
      }

      res.send({
         status: 'successfully deleted',
         data: {
            id: id,
         },
      });
   } catch (error) {
      console.log(error);
      res.status(500).send({
         status: 'error',
         message: 'server error',
      });
   }
};

exports.checkAuth = async (req, res) => {
   console.log('hitting checkAuth');

   try {
      const user = await User.findOne({
         where: {
            id: req.user.id,
         },
      });

      res.send({
         status: 'success',
         message: 'User Valid',
         data: {
            user,
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

exports.getUserById = async (req, res) => {
   try {
      console.log('hitting getUserById-------------');
      const { id } = req.params;
      const getUser = await User.findByPk(id, {
         attributes: {
            exclude: ['createdAt', 'updatedAt', 'password', 'usernotif'],
         },
      });
      if (!getUser) {
         return res.status(400).send({
            status: 'Search User Failed',
            message: "User Doesn't exist",
         });
      }

      if (getUser) {
         console.log('success', getUser.id);
         return res.send({
            status: 'success',
            data: {
               user: getUser,
            },
         });
      }
   } catch (error) {
      console.log(error);
      res.status(500).send({
         status: 'error',
         message: 'server error',
      });
   }
};

exports.checkAuth = async (req, res) => {
   console.log('hitting checkAuth');

   try {
      const user = await User.findOne({
         where: {
            id: req.user.id,
         },
         attributes: {
            exclude: ['createdAt', 'updatedAt', 'password', 'usernotif'],
         },
      });

      res.send({
         status: 'success',
         message: 'User Valid',
         data: {
            user,
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

exports.updateUser = async (req, res) => {
   // UNDONE -> validasi id user dengan id user yang dimiliki oleh table transaksi untuk melakukan update

   const { iduser } = req.params;
   const { body } = req;
   try {
      const findUser = await User.findByPk(iduser);

      if (!findUser) {
         return res.send({
            status: 'fail',
            message: `User with id ${id} not found,
                   `,
         });
      }

      if (findUser.id !== req.user.id) {
         return res.send({
            status: 'fail',
            message: `User with id ${id} not found,
                 `,
         });
      }

      const updatedUser = await User.update(body, {
         where: {
            id: iduser,
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

exports.registerUserAdmin = async (req, res) => {
   try {
      const { body } = req;
      const { email, name, username, password, bio, image } = body;

      // console.log('serveruser', req.body);

      const schema = Joi.object({
         email: Joi.string().email().min(3).max(50).required(),
         password: Joi.string().min(3).max(100).required(),
         fullname: Joi.string().min(3).max(50).required(),
         password: Joi.string().min(3).max(50).required(),
         gender: Joi.string().min(3).max(50).required(),
         phone: Joi.string().min(3).max(50).required(),
         address: Joi.string().min(3).max(50).required(),
      });
      console.log('tes here');
      const { error } = schema.validate(req.body);

      if (error)
         return res.status(400).send({
            status: 'validation failed',
            message: error.details[0].message,
         });

      const checkEmail = await User.findOne({
         where: {
            email: req.body.email,
         },
      });
      console.log(req.body);
      if (checkEmail)
         return res.status(400).send({
            status: 'Register failed',
            message: 'Email already registered',
         });

      const hashStrength = 10;
      const hashedPassword = await bcrypt.hash(req.body.password, hashStrength);

      const user = await User.create({
         email: req.body.email,
         fullname: req.body.fullname,
         password: hashedPassword,
         listAs: '0',
         gender: req.body.gender,
         phone: req.body.phone,
         address: req.body.address,
         isAdmin: true,
         subcribe: '',
         photoprofile: 'photo-pp.jpg',
      });
      console.log('tes here');
      const secretKey = process.env.SECRET_KEY;
      const token = jwt.sign(
         {
            id: user.id,
         },
         secretKey
      );
      console.log(token);
      res.send({
         status: 'success',
         message: 'User Succesfully Registered',
         data: {
            user: {
               email: user.email,
               name: user.name,
               token,
            },
         },
      });
   } catch (err) {
      console.log(err);
      res.status(500).send({
         status: 'error',
         message: err,
      });
   }
};
