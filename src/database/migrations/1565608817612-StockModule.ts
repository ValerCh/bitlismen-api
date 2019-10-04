import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class StockModule1565608817612 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: 'stock_modules_module',
      columns: [
        {
          name: 'id',
          type: 'int',
          length: '11',
          isPrimary: true,
          isNullable: false,
          isGenerated: true,
          generationStrategy: 'increment',
        }, {
          name: 'stockId',
          type: 'varchar',
          length: '255',
          isPrimary: true,
          isNullable: false,
        }, {
          name: 'moduleId',
          type: 'varchar',
          length: '255',
          isPrimary: true,
          isNullable: false,
        }, {
          name: 'StockModuleQty',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: true,
          default: 1,
        }, {
          name: 'StockModulePrice',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: true,
          default: 1,
        },
      ],
    });
    await queryRunner.createTable(table);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('stock_modules_module');
  }

}
