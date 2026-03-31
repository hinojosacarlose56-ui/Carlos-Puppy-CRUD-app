import {Sequelize, DataTypes} from 'sequelize';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const bearerToken = 'Bearer aaa.eyJzdWIiOiIxMjMifQ.bbb';
const token = bearerToken.slice(7);
const header = bearerToken.split(' ')[0];
const payload = bearerToken.split('.')[1];
const signature = bearerToken.split('.')[2];

if(!token)
  console.log('No token provided');

// console.log('Token is valid');
// console.log('Bearer Token:', token);
// console.log('Header:', header);
// console.log('Payload:', payload);
// console.log('Signature:', signature);

dotenv.config();

const UseSSL = process.env.PGSSLMODE === 'require';
const DB_SCHEMA = process.env.DB_SCHEMA;
const app = express();

app.use(cors())
app.use(express.json())

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  // TODO: Verify token using Asgardeo’s JWKS / library for your framework.
  const payload = verifyWithAsgardeo(token); // returns decoded token

  req.user = {
    id: payload.sub, // unique user id from Asgardeo
  };

  next();
}

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  dialect: 'postgres',
  dialectOptions: UseSSL
    ? {
        SSL: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : undefined,
  define: {
    schema: DB_SCHEMA,
  },
});

const puppies =sequelize.define('puppies', {

  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  breed: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

}, {
  schema: DB_SCHEMA,
  tableName: 'puppies',
  timestamps: false,
});


//Add in the CRUD functions: 
app.get('/puppies', async (req, res) => {
    try {
      const allPuppies = await puppies.findAll();
      res.json(allPuppies);
    } catch (err) {
      console.error('Error fetching puppies: ', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/puppies/:id', async (req, res) => {
  try {
    const puppyId = req.params.id;
    const puppy = await puppies.findByPk(puppyId);
    
    if (!puppy) {
      return res.status(404).json({ error: 'Puppy not found' });
    }
    
    res.json(puppy);
  } catch (err) {
    console.error('Error fetching puppy: ', err);
    res.status(500).json({ error: 'Internal server error' });
  }
  
});
  app.put('/puppies/:id', async (req, res) => {
    const { id } = req.params;
    const { name, breed, age } = req.body;  
    try {
      const puppy = await puppies.findByPk(id);
      if (!puppy) {
        return res.status(404).json({ error: 'Puppy not found' });
      }
      puppy.name = name;
      puppy.breed = breed;
      puppy.age = age;
      await puppy.save();
      res.json(puppy);
    } catch (err) {
      console.error('Error updating puppy: ', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/puppies', async (req, res) => {
    const { name, breed, age } = req.body;  
    try {
      const newPuppy = await puppies.create({ name, breed, age });
      res.status(201).json(newPuppy);
    } catch (err) {
      console.error('Error creating puppy: ', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.delete('/puppies/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const puppy = await puppies.findByPk(id);
      if (!puppy) {
        return res.status(404).json({ error: 'Puppy not found' });
      }
      await puppy.destroy();
      res.json({ message: 'Puppy deleted successfully' });
    } catch (err) {
      console.error('Error deleting puppy: ', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  //double check these routes and make sure they are correct.^o^

  const PORT = process.env.PORT || 5001;
  
  const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');

    await puppies.sync({ alter: true });
    console.log(`Puppies model synced in schema "${DB_SCHEMA}".`);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error: ', err);
    process.exit(1);  // Exit with failure code
  }
};

startServer();