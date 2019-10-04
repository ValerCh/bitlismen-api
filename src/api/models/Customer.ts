import {IsNotEmpty} from 'class-validator';
import {Column, Entity, OneToOne, PrimaryColumn} from 'typeorm';
import {Opportunity} from './Opportunity';

@Entity()
export class Customer {

  @PrimaryColumn('uuid')
  public id: string;

  @IsNotEmpty()
  @Column()
  public CRName: string;

  @IsNotEmpty()
  @Column()
  public CRShortName: string;

  @IsNotEmpty()
  @Column()
  public CRDepartment: string;

  @IsNotEmpty()
  @Column()
  public CRDescription: string;

  @IsNotEmpty()
  @Column()
  public CRCountry: string;

  @IsNotEmpty()
  @Column()
  public CRCity: string;

  @IsNotEmpty()
  @Column()
  public CRAddress: string;

  @IsNotEmpty()
  @Column()
  public CRWeb: string;

  @IsNotEmpty()
  @Column()
  public CRContact: string;

  @IsNotEmpty()
  @Column()
  public CRRating: string;

  @OneToOne(type => Opportunity, opportunity => opportunity.customer)
  public opportunity: Opportunity;

  public toString(): string {
    return `${this.id}`;
  }

}
