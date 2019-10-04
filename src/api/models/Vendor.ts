import {IsNotEmpty} from 'class-validator';
import {Column, Entity, OneToOne, PrimaryColumn} from 'typeorm';
import {Component} from './Component';

@Entity()
export class Vendor {

  @PrimaryColumn('uuid')
  public id: string;

  @IsNotEmpty()
  @Column()
  public VRName: string;

  @IsNotEmpty()
  @Column()
  public VRShortName: string;

  @IsNotEmpty()
  @Column()
  public VRDescription: string;

  @IsNotEmpty()
  @Column()
  public VRCountry: string;

  @IsNotEmpty()
  @Column()
  public VRCity: string;

  @IsNotEmpty()
  @Column()
  public VRAddress: string;

  @IsNotEmpty()
  @Column()
  public VRWeb: string;

  @IsNotEmpty()
  @Column()
  public VRWebStore: string;

  @IsNotEmpty()
  @Column()
  public VRContact: string;

  @IsNotEmpty()
  @Column()
  public VRRating: string;

  @OneToOne(type => Component, component => component.vendor)
  public component: Component;

  public toString(): string {
    return `${this.id}`;
  }

}
