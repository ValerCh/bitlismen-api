import {IsNotEmpty} from 'class-validator';
import {Column, Entity, OneToOne, PrimaryColumn} from 'typeorm';
import {Services} from './Service';
import {Transaction} from './Transaction';
import {Component} from './Component';

@Entity()
export class Shop {

  @PrimaryColumn('uuid')
  public id: string;

  @IsNotEmpty()
  @Column()
  public SPName: string;

  @IsNotEmpty()
  @Column()
  public SPShortName: string;

  @IsNotEmpty()
  @Column()
  public SPDescription: string;

  @IsNotEmpty()
  @Column()
  public SPCountry: string;

  @IsNotEmpty()
  @Column()
  public SPCity: string;

  @IsNotEmpty()
  @Column()
  public SPAddress: string;

  @IsNotEmpty()
  @Column()
  public SPWeb: string;

  @IsNotEmpty()
  @Column()
  public SPWebStore: string;

  @IsNotEmpty()
  @Column()
  public SPContact: string;

  @IsNotEmpty()
  @Column()
  public SPRating: string;

  @IsNotEmpty()
  @Column()
  public SPPaymentMethod: string;

  @OneToOne(type => Services, services => services.shop)
  public services: Services;

  @OneToOne(type => Transaction, transaction => transaction.shop)
  public transaction: Transaction;

  @OneToOne(type => Component, component => component.primaryShop)
  public component: Component;

  public toString(): string {
    return `${this.id}`;
  }

}
