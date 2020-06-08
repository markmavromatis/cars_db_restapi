import {Table, Column, Model, HasMany, PrimaryKey, CreatedAt, UpdatedAt} from 'sequelize-typescript';

@Table
export class Vehicle extends Model<Vehicle> {

  @PrimaryKey
  @Column
  public vendor!: string;

  @PrimaryKey
  @Column
  @CreatedAt
  public autofiCreatedAt: Date = new Date();

  @Column
  @UpdatedAt
  public autofiUpdatedAt: Date = new Date();

}
