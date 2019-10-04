import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class Assembly1561382081816 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: 'assembly',
      columns: [
        {
          name: 'id',
          type: 'varchar',
          length: '255',
          isPrimary: true,
          isNullable: false,
        }, {
          name: 'AName',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'AShortName',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'AType',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'ATypeDescription',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'APLEPartNumber',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'ARevision',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'ADescription',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'APhoto',
          type: 'longblob',
          isNullable: true,
        }, {
          name: 'ANetSizeHeight',
          type: 'int',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'ANetSizeWidth',
          type: 'int',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'ANetSizeLength',
          type: 'int',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'ANetWeight',
          type: 'int',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'AGrossWeight',
          type: 'int',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'AMarginPercent',
          type: 'int',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'AEOL',
          type: 'tinyint',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'ATag',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'AQuantity',
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
    await queryRunner.dropTable('assembly');
  }

}
