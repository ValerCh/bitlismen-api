import {MigrationInterface, QueryRunner, TableColumn} from 'typeorm';

export class AddColumn1563867368047 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn('component', new TableColumn({
      name: 'CQuantity',
      type: 'varchar',
      length: '255',
      isPrimary: false,
      default: 0,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    console.log('done');
  }

}
