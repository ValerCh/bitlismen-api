import {IsNotEmpty} from 'class-validator';
import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryColumn} from 'typeorm';
import {Component} from './Component';
import {Shop} from './Shop';
import {Opportunity} from './Opportunity';
import {Module} from './Module';
import {Assembly} from './Assembly';

@Entity()
export class Transaction {

  @PrimaryColumn('uuid')
  public id: string;

  @IsNotEmpty()
  @Column()
  public TDateTime: string;

  @IsNotEmpty()
  @Column()
  public TType: string;

  @IsNotEmpty()
  @Column()
  public Shop_ID: string;

  @IsNotEmpty()
  @Column()
  public Opportunity_ID: string;

  @IsNotEmpty()
  @Column()
  public TContactPerson: string;

  @ManyToMany(type => Component, {
    cascade: true,
  })
  @JoinTable()
  public components: Component[];

  @ManyToMany(type => Module, {
    cascade: true,
  })
  @JoinTable()
  public modules: Module[];

  @ManyToMany(type => Assembly, {
    cascade: true,
  })
  @JoinTable()
  public assemblies: Assembly[];

  @OneToOne(type => Shop, shop => shop.transaction)
  @JoinColumn({name: 'Shop_ID'})
  public shop: Shop;

  @OneToOne(type => Opportunity, opportunity => opportunity.transaction)
  @JoinColumn({name: 'Opportunity_ID'})
  public opportunity: Opportunity;

  public toString(): string {
    return `${this.id}`;
  }

}
