import {IsNotEmpty} from 'class-validator';
import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity()
export class Permissions {

  @PrimaryColumn('uuid')
  public id: string;

  @IsNotEmpty()
  @Column()
  public can_do: string;

  public toString(): string {
    return `${this.id}`;
  }

}
