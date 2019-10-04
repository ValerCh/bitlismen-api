import {IsNotEmpty} from 'class-validator';
import {Column, Entity, OneToOne, PrimaryColumn} from 'typeorm';
import {Opportunity} from './Opportunity';

@Entity()
export class Reseller {

  @PrimaryColumn('uuid')
  public id: string;

  @IsNotEmpty()
  @Column()
  public RRName: string;

  @IsNotEmpty()
  @Column()
  public RRShortName: string;

  @IsNotEmpty()
  @Column()
  public RRDescription: string;

  @IsNotEmpty()
  @Column()
  public RRCountry: string;

  @IsNotEmpty()
  @Column()
  public RRCity: string;

  @IsNotEmpty()
  @Column()
  public RRAddress: string;

  @IsNotEmpty()
  @Column()
  public RRWeb: string;

  @IsNotEmpty()
  @Column()
  public RRContact: string;

  @IsNotEmpty()
  @Column()
  public RRRating: string;

  @OneToOne(type => Opportunity, opportunity => opportunity.reseller)
  public opportunity: Opportunity;

  public toString(): string {
    return `${this.id}`;
  }

}
