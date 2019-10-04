import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class Transaction1561465987076 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: 'transaction',
      columns: [
        {
          name: 'id',
          type: 'varchar',
          length: '255',
          isPrimary: true,
          isNullable: false,
        }, {
          name: 'TDateTime',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'TType',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'Shop_ID',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'Opportunity_ID',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'TContactPerson',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        },
      ],
    });
    await queryRunner.createTable(table);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('transaction');
  }

}
