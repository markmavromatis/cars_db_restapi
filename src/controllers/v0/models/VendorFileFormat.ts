import {Table, Column, Model, HasMany, PrimaryKey, CreatedAt, UpdatedAt} from 'sequelize-typescript';

@Table
export class VendorFileFormat extends Model<VendorFileFormat> {

  @PrimaryKey
  @Column
  public vendorId!: string;

  @Column
  public columns!: string;

  @PrimaryKey
  @Column
  @CreatedAt
  public autofiCreatedAt: Date = new Date();

  @Column
  @UpdatedAt
  public autofiUpdatedAt: Date = new Date();

}
