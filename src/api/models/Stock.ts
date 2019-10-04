import {IsNotEmpty} from 'class-validator';
import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from 'typeorm';
import {Component} from './Component';
import {Module} from './Module';
import {Assembly} from './Assembly';

@Entity()
export class Stock {

  @PrimaryColumn('uuid')
  public id: string;

  @IsNotEmpty()
  @Column()
  public SLocationRoom: string;

  @IsNotEmpty()
  @Column()
  public SLocationRow: string;

  @IsNotEmpty()
  @Column()
  public SLocationColumn: string;

  @IsNotEmpty()
  @Column()
  public StockComponentQty: string;

  @IsNotEmpty()
  @Column()
  public StockComponentPrice: string;

  @IsNotEmpty()
  @Column()
  public componentId: string;

  @IsNotEmpty()
  @Column()
  public StockAssemblyQty: string;

  @IsNotEmpty()
  @Column()
  public StockAssemblyPrice: string;

  @IsNotEmpty()
  @Column()
  public assemblyId: string;

  @IsNotEmpty()
  @Column()
  public StockModuleQty: string;

  @IsNotEmpty()
  @Column()
  public StockModulePrice: string;

  @IsNotEmpty()
  @Column()
  public moduleId: string;

  @OneToOne(type => Component, component => component.stock)
  @JoinColumn({name: 'componentId'})
  public component: Component[];

  @OneToOne(type => Assembly, assembly => assembly.stock)
  @JoinColumn({name: 'assemblyId'})
  public assembly: Assembly[];

  @OneToOne(type => Module, module => module.stock)
  @JoinColumn({name: 'moduleId'})
  public module: Module[];

  // @ManyToMany(type => Component, {
  //   cascade: true,
  // })
  // @JoinTable()
  // public components: Component[];
  //
  // @ManyToMany(type => Module, {
  //   cascade: true,
  // })
  // @JoinTable()
  // public modules: Module[];
  //
  // @ManyToMany(type => Assembly, {
  //   cascade: true,
  // })
  // @JoinTable()
  // public assemblies: Assembly[];

  public toString(): string {
    return `${this.id}`;
  }

}
