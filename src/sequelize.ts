import {Sequelize} from 'sequelize-typescript';

// Instantiate new Sequelize instance!
export const sequelize = new Sequelize('sqlite::memory:')
