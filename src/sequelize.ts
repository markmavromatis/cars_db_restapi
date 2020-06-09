import {Sequelize} from 'sequelize-typescript';

// Instantiate new Sequelize instance!
// Use logging option to enable/disable SQL logging statements.
export const sequelize = new Sequelize('sqlite::memory:', {logging: false})
