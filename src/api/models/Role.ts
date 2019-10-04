import {IsNotEmpty} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';
import {User} from './User';
import {Permissions} from './Permissions';

@Entity()
export class Role {

  @PrimaryColumn('uuid')
  public id: string;

  @IsNotEmpty()
  @Column()
  public role_internal_name: string;

  @IsNotEmpty()
  @Column()
  public role_display_name: string;

  @CreateDateColumn({name: 'created_at', type: 'timestamp'})
  public created_at: Date;

  @UpdateDateColumn({name: 'updated_at', type: 'timestamp'})
  public updated_at: Date;

  @OneToOne(type => User, user => user.role)
  public user: User;

  @ManyToMany(type => Permissions, {
    cascade: true,
  })
  @JoinTable()
  public permissions: Permissions[];

  public toString(): string {
    return `${this.id}`;
  }

}
