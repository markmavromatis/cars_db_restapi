import {Table, Column, ForeignKey, Model, HasMany, PrimaryKey, CreatedAt, UpdatedAt} from 'sequelize-typescript';
import {Vendor} from "./Vendor"

@Table
export class VendorFileFormat extends Model<VendorFileFormat> {

  @PrimaryKey
  @ForeignKey(() => Vendor)
  @Column
  public vendorId!: string;

  @Column
  public columns!: string;

  @Column
  @CreatedAt
  public autofiCreatedAt: Date = new Date();

  @Column
  @UpdatedAt
  public autofiUpdatedAt: Date = new Date();

}
