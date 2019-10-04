import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class Module1561125601831 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: 'module',
      columns: [
        {
          name: 'id',
          type: 'varchar',
          length: '255',
          isPrimary: true,
          isNullable: false,
        }, {
          name: 'MName',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'MShortName',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'MType',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'MTypeDescription',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'MPLEPartNumber',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'MRevision',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'MDescription',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'MPhoto',
          type: 'longblob',
          isNullable: true,
        }, {
          name: 'MNetSizeHeight',
          type: 'int',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'MNetSizeWidth',
          type: 'int',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'MNetSizeLength',
          type: 'int',
          isPrimary: false,
          isNullable: false,
        },  {
          name: 'MNetWeight',
          type: 'int',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'MGrossWeight',
          type: 'int',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'MMarginPercent',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'MEOL',
          type: 'tinyint',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'MTag',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'MQuantity',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          default: 0,
        },
      ],
    });
    await queryRunner.createTable(table);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('module');
  }

}
