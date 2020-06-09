import {Table, Column, ForeignKey, Index, Model, HasMany, PrimaryKey, CreatedAt, UpdatedAt} from 'sequelize-typescript';
import {UploadFileError} from "./UploadFileError"
import {Vendor} from "./Vendor"

@Table
export class UploadFile extends Model<UploadFile> {

  @Column
  public filePath!: string;

  @ForeignKey(() => Vendor)
  @Index
  @Column
  public vendorId!: string;

  @Column
  public uploadSuccessful!: boolean;

  @HasMany(() => UploadFileError)
  errors: UploadFileError[];

  @Column
  @CreatedAt
  public autofiCreatedAt: Date = new Date();

  @Column
  @UpdatedAt
  public autofiUpdatedAt: Date = new Date();

  toJsonResponse() : string {
    return "Hello World";
  }
}
