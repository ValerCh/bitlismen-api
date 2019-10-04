import {IsNotEmpty} from 'class-validator';
import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryColumn} from 'typeorm';
import {Services} from './Service';
import {Trainer} from './Trainer';
import {Customer} from './Customer';
import {Reseller} from './Reseller';
import {Transaction} from './Transaction';
import {Tag} from './Tag';
import {User} from './User';

@Entity()
export class Opportunity {

  @PrimaryColumn('uuid')
  public id: string;

  @IsNotEmpty()
  @Column()
  public OName: string;

  @IsNotEmpty()
  @Column()
  public OShortName: string;

  @IsNotEmpty()
  @Column()
  public ODescription: string;

  @IsNotEmpty()
  @Column()
  public OStatus: string;

  @IsNotEmpty()
  @Column()
  public Customer_ID: string;

  @IsNotEmpty()
  @Column()
  public Reseller_ID: string;

  @IsNotEmpty()
  @Column()
  public OStart: string;

  @IsNotEmpty()
  @Column()
  public OManufacturingStart: string;

  @IsNotEmpty()
  @Column()
  public OManufacturingDeadline: string;

  @IsNotEmpty()
  @Column()
  public ODeliveryDeadline: string;

  @IsNotEmpty()
  @Column()
  public OHandOverDeadline: string;

  @IsNotEmpty()
  @Column()
  public OPaymetTerms: string;

  @IsNotEmpty()
  @Column()
  public OShippingTerms: string;

  @IsNotEmpty()
  @Column()
  public OTag: string;

  @IsNotEmpty()
  @Column()
  public OwningUser: boolean;

  @ManyToMany(type => Trainer, {
    cascade: true,
  })
  @JoinTable()
  public trainers: Trainer[];

  @ManyToMany(type => Services, {
    cascade: true,
  })
  @JoinTable()
  public services: Services[];

  @OneToOne(type => Customer, customer => customer.opportunity)
  @JoinColumn({name: 'Customer_ID'})
  public customer: Customer;

  @OneToOne(type => Reseller, reseller => reseller.opportunity)
  @JoinColumn({name: 'Reseller_ID'})
  public reseller: Reseller;

  @OneToOne(type => User, user => user.opportunity)
  @JoinColumn({name: 'OwningUser'})
  public owninguser: User;

  @OneToOne(type => Transaction, transaction => transaction.opportunity)
  public transaction: Transaction;

  @OneToOne(type => Tag, tag => tag.opportunity)
  @JoinColumn({name: 'OTag'})
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
