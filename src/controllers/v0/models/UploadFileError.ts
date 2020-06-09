import {Table, Column, ForeignKey, Index, Model, HasMany, PrimaryKey, CreatedAt, UpdatedAt, BelongsTo} from 'sequelize-typescript';
import {UploadFile} from "./UploadFile"

@Table
export class UploadFileError extends Model<UploadFileError> {

    @ForeignKey(() => UploadFile)
    @Index
    @Column
    public uploadFileId!: number;

    @BelongsTo(() => UploadFile)
    uploadFile: UploadFile

    @Column
    public row!: number;

    @Column
    public errorMessage!: string;

    @Column
    @CreatedAt
    public autofiCreatedAt: Date = new Date();

    @Column
    @UpdatedAt
    public autofiUpdatedAt: Date = new Date();

}
