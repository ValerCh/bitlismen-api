import {IsNotEmpty} from 'class-validator';
import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryColumn} from 'typeorm';
import {Services} from './Service';
import {Module} from './Module';
import {Tag} from './Tag';

@Entity()
export class Trainer {

  @PrimaryColumn('uuid')
  public id: string;

  @IsNotEmpty()
  @Column()
  public TName: string; // required

  @IsNotEmpty()
  @Column()
  public TShortName: string; // required

  @IsNotEmpty()
  @Column()
  public TPLEPartNumber: string; // required

  @IsNotEmpty()
  @Column()
  public TRevision: string;

  @IsNotEmpty()
  @Column()
  public TDescription: string; // required

  @IsNotEmpty()
  @Column()
  public TNetWeight: number;

  @IsNotEmpty()
  @Column()
  public TGrossWeight: number;

  @IsNotEmpty()
  @Column()
  public TEOL: boolean;

  @IsNotEmpty()
  @Column()
  public TTag: string;

  @ManyToMany(type => Module, {
    cascade: true,
  })
  @JoinTable()
  public modules: Module[];

  @ManyToMany(type => Services, {
    cascade: true,
  })
  @JoinTable()
  public services: Services[];

  @OneToOne(type => Tag, tag => tag.trainers)
  @JoinColumn({name: 'TTag'})
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
