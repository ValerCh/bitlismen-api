import { IsNotEmpty } from 'class-validator';
import {
    Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryColumn
} from 'typeorm';

import { Component } from './Component';
import { Services } from './Service';
import { Stock } from './Stock';
import { Tag } from './Tag';

@Entity()
export class Assembly {

  @PrimaryColumn('uuid')
  public id: string;

  @IsNotEmpty()
  @Column()
  public AName: string; // required

  @IsNotEmpty()
  @Column()
  public AShortName: string; // required

  @IsNotEmpty()
  @Column()
  public AType: string;

  @IsNotEmpty()
  @Column()
  public ATypeDescription: string;

  @IsNotEmpty()
  @Column()
  public APLEPartNumber: string; // required

  @IsNotEmpty()
  @Column()
  public ARevision: string;

  @IsNotEmpty()
  @Column()
  public ADescription: string; // required

  @IsNotEmpty()
  @Column()
  public APhoto: string;

  @IsNotEmpty()
  @Column()
  public ANetSizeHeight: number;

  @IsNotEmpty()
  @Column()
  public ANetSizeWidth: number;

  @IsNotEmpty()
  @Column()
  public ANetSizeLength: number;

  @IsNotEmpty()
  @Column()
  public ANetWeight: number;

  @IsNotEmpty()
  @Column()
  public AGrossWeight: number;

  @IsNotEmpty()
  @Column()
  public AMarginPercent: number;

  @IsNotEmpty()
  @Column()
  public AEOL: boolean;

  @IsNotEmpty()
  @Column()
  public ATag: string;

  @OneToOne(type => Stock, stock => stock.assembly)
  public stock: Stock;

  @ManyToMany(type => Component, {
    cascade: true,
  })
  @JoinTable()
  public components: Component[];

  @ManyToMany(type => Services, {
    cascade: true,
  })
  @JoinTable()
  public services: Services[];

  @OneToOne(type => Tag, tag => tag.assemblies)
  @JoinColumn({name: 'ATag'})
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
