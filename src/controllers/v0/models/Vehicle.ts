import {Table, Column, Model, HasMany, PrimaryKey, CreatedAt, UpdatedAt} from 'sequelize-typescript';

@Table
export class Vehicle extends Model<Vehicle> {

  @Column
  public uuid: string;

  @Column
  // Vehicle Identification Number
  public vin: string; 

  @Column
  // Vehicle Make
  public make: string; 

  @Column
  // Vehicle Model
  public model: string; 

  @Column
  // Vehicle Mileage
  public mileage: string; 

  @Column
  // Vehicle Year
  public year: string; 

  @Column
  // Vehicle Price
  public price: number;

  @Column
  @CreatedAt
  public autofiCreatedAt: Date = new Date();

  @Column
  @UpdatedAt
  public autofiUpdatedAt: Date = new Date();

}