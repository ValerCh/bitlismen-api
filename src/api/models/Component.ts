import {IsNotEmpty} from 'class-validator';
import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryColumn} from 'typeorm';
import {Vendor} from './Vendor';
import {Shop} from './Shop';
import {Tag} from './Tag';
import {Stock} from './Stock';

@Entity()
export class Component {

  @PrimaryColumn('uuid')
  public id: string;

  @IsNotEmpty()
  @Column()
  public CName: string;

  @IsNotEmpty()
  @Column({unique: true})
  public CVendorPartNumber: string;

  @IsNotEmpty()
  @Column()
  public CPrimaryShopPartNumber: string;

  @IsNotEmpty()
  @Column()
  public CSecondaryShopPartNumber: string;

  @IsNotEmpty()
  @Column()
  public CTertiaryShopPartNumber: string;

  @IsNotEmpty()
  @Column()
  public CDescription: string;

  @IsNotEmpty()
  @Column()
  public CPoto: string;

  @IsNotEmpty()
  @Column()
  public Vendor_ID: string;

  @IsNotEmpty()
  @Column()
  public PrimaryShop_ID: string;

  @IsNotEmpty()
  @Column()
  public SecondaryShop_ID: string;

  @IsNotEmpty()
  @Column()
  public TertiaryShop_ID: string;

  @IsNotEmpty()
  @Column()
  public CUnit: string;

  @IsNotEmpty()
  @Column()
  public CCostUSD: string;

  @IsNotEmpty()
  @Column()
  public CCostRUB: string;

  @IsNotEmpty()
  @Column()
  public CCostAMD: string;

  @IsNotEmpty()
  @Column()
  public CEOL: boolean;

  @IsNotEmpty()
  @Column()
  public CTag: string;

  @OneToOne(type => Stock, stock => stock.component)
  public stock: Stock;

  @OneToOne(type => Vendor, vendor => vendor.component)
  @JoinColumn({name: 'Vendor_ID'})
  public vendor: Vendor;

  @OneToOne(type => Shop, shop => shop.component)
  @JoinColumn({name: 'PrimaryShop_ID'})
  public primaryShop: Shop;

  @OneToOne(type => Shop, shop => shop.component)
  @JoinColumn({name: 'SecondaryShop_ID'})
  public secondaryShop: Shop;

  @OneToOne(type => Shop, shop => shop.component)
  @JoinColumn({name: 'TertiaryShop_ID'})
  public tertiaryShop: Shop;

  @OneToOne(type => Tag, tag => tag.assemblies)
  @JoinColumn({name: 'CTag'})
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
