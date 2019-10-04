import {IsNotEmpty} from 'class-validator';
import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryColumn} from 'typeorm';
import {Component} from './Component';
import {Services} from './Service';
import {Assembly} from './Assembly';
import {Tag} from './Tag';
import {Stock} from './Stock';

@Entity()
export class Module {

  @PrimaryColumn('uuid')
  public id: string;

  @IsNotEmpty()
  @Column()
  public MName: string;

  @IsNotEmpty()
  @Column()
  public MShortName: string;

  @IsNotEmpty()
  @Column()
  public MType: string;

  @IsNotEmpty()
  @Column()
  public MTypeDescription: string;

  @IsNotEmpty()
  @Column()
  public MPLEPartNumber: string;

  @IsNotEmpty()
  @Column()
  public MRevision: string;

  @IsNotEmpty()
  @Column()
  public MDescription: string;

  @IsNotEmpty()
  @Column()
  public MPhoto: string;

  @IsNotEmpty()
  @Column()
  public MNetSizeHeight: number;

  @IsNotEmpty()
  @Column()
  public MNetSizeWidth: number;

  @IsNotEmpty()
  @Column()
  public MNetSizeLength: number;

  @IsNotEmpty()
  @Column()
  public MNetWeight: number;

  @IsNotEmpty()
  @Column()
  public MGrossWeight: number;

  @IsNotEmpty()
  @Column()
  public MMarginPercent: string;

  @IsNotEmpty()
  @Column()
  public MEOL: boolean;

  @IsNotEmpty()
  @Column()
  public MTag: string;

  @OneToOne(type => Stock, stock => stock.module)
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

  @ManyToMany(type => Assembly, {
    cascade: true,
  })
  @JoinTable()
  public assemblies: Assembly[];

  @OneToOne(type => Tag, tag => tag.modules)
  @JoinColumn({name: 'MTag'})
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
