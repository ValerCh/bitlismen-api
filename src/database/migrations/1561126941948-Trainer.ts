import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class Trainer1561126941948 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: 'trainer',
      columns: [
        {
          name: 'id',
          type: 'varchar',
          length: '255',
          isPrimary: true,
          isNullable: false,
        }, {
          name: 'TName',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'TShortName',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'TPLEPartNumber',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'TRevision',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'TDescription',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'TNetWeight',
          type: 'int',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'TGrossWeight',
          type: 'int',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'TEOL',
          type: 'tinyint',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'TTag',
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
    await queryRunner.dropTable('trainer');
  }

}
