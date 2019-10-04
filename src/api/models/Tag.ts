import {IsNotEmpty} from 'class-validator';
import {Column, Entity, OneToOne, PrimaryColumn} from 'typeorm';
import {Services} from './Service';
import {Assembly} from './Assembly';
import {Module} from './Module';
import {Trainer} from './Trainer';
import {Opportunity} from './Opportunity';

@Entity()
export class Tag {

  @PrimaryColumn('uuid')
  public id: string;

  @IsNotEmpty()
  @Column()
  public TGName: string;

  @OneToOne(type => Services, services => services.tag)
  public services: Services;

  @OneToOne(type => Assembly, assembly => assembly.tag)
  public assemblies: Assembly;

  @OneToOne(type => Module, mod => mod.tag)
  public modules: Module;

  @OneToOne(type => Trainer, trainer => trainer.tag)
  public trainers: Trainer;

  @OneToOne(type => Opportunity, opportunity => opportunity.tag)
  public opportunity: Opportunity;

  public toString(): string {
    return `${this.id}`;
  }

}
