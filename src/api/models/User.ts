import * as bcrypt from 'bcrypt';
import {IsNotEmpty} from 'class-validator';
import {BeforeInsert, Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from 'typeorm';
import {Role} from './Role';
import {Opportunity} from './Opportunity';

@Entity()
export class User {

  public static hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return reject(err);
        }
        resolve(hash);
      });
    });
  }

  public static comparePassword(user: User, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        resolve(res === true);
      });
    });
  }

  @PrimaryColumn('uuid')
  public id: string;

  @IsNotEmpty()
  @Column()
  public first_name: string;

  @IsNotEmpty()
  @Column()
  public last_name: string;

  @IsNotEmpty()
  @Column()
  public email: string;

  @IsNotEmpty()
  @Column()
  public password: string;

  @IsNotEmpty()
  @Column()
  public role_id: string;

  @IsNotEmpty()
  @Column()
  public reset_code: string;

  @OneToOne(type => Role, role => role.user)
  @JoinColumn({name: 'role_id'})
  public role: Role;

  @OneToOne(type => Opportunity, opportunity => opportunity.owninguser)
  public opportunity: Opportunity;

  public toString(): string {
    return `${this.id}`;
  }

  @BeforeInsert()
  public async hashPassword(): Promise<void> {
    console.log('Hashing........');
    this.password = await User.hashPassword(this.password);
  }

}
