import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class StockComponent1561464974611 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: 'stock_components_component',
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
          name: 'componentId',
          type: 'varchar',
          length: '255',
          isPrimary: true,
          isNullable: false,
        }, {
          name: 'StockComponentQty',
          type: 'varchar',
          length: '255',
          isPrimary: true,
          isNullable: false,
          default: 1,
        }, {
          name: 'StockComponentPrice',
          type: 'varchar',
          length: '255',
          isPrimary: true,
          isNullable: false,
          default: 1,
        },
      ],
    });
    await queryRunner.createTable(table);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('stock_components_component');
  }

}
