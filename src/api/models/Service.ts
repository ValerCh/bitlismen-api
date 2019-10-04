import {IsNotEmpty} from 'class-validator';
import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryColumn} from 'typeorm';
import {Shop} from './Shop';
import {Tag} from './Tag';

@Entity()
export class Services {

  @PrimaryColumn('uuid')
  public id: string;

  @IsNotEmpty()
  @Column()
  public SName: string; // required

  @IsNotEmpty()
  @Column()
  public SShortName: string; // required

  @IsNotEmpty()
  @Column()
  public SDescription: string; // required

  @IsNotEmpty()
  @Column()
  public Shop_ID: string; // required

  @IsNotEmpty()
  @Column()
  public SUnit: string;

  @IsNotEmpty()
  @Column()
  public SCostUSD: string;

  @IsNotEmpty()
  @Column()
  public SCostRUB: string;

  @IsNotEmpty()
  @Column()
  public SCostAMD: string;

  @IsNotEmpty()
  @Column()
  public SEOL: boolean;

  @IsNotEmpty()
  @Column()
  public STag: string;

  @OneToOne(type => Shop, shop => shop.services)
  @JoinColumn({name: 'Shop_ID'})
  public shop: Shop;

  @OneToOne(type => Tag, tag => tag.services)
  @JoinColumn({name: 'STag'})
  public tag: Tag;

  @ManyToMany(type => Tag, {
    cascade: true,
  })
  @JoinTable()
  public tags: Tag[];

  public toString(): string {
    return `${this.id}`;
  }

}
