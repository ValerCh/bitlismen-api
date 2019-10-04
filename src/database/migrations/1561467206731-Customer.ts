import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class Customer1561467206731 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: 'customer',
      columns: [
        {
          name: 'id',
          type: 'varchar',
          length: '255',
          isPrimary: true,
          isNullable: false,
        }, {
          name: 'CRName',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'CRShortName',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'CRDepartment',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'CRDescription',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'CRCountry',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'CRCity',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'CRAddress',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'CRWeb',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'CRContact',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'CRRating',
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
    await queryRunner.dropTable('customer');
  }

}
