import {Table, Column, Model, HasMany, PrimaryKey, CreatedAt, UpdatedAt} from 'sequelize-typescript';

@Table
export class Vendor extends Model<Vendor> {

    @PrimaryKey
    @Column
    public vendorId!: string;

    @Column
    public vendorName!: string;

    @Column
    @CreatedAt
    public autofiCreatedAt: Date = new Date();

    @Column
    @UpdatedAt
    public autofiUpdatedAt: Date = new Date();

}
