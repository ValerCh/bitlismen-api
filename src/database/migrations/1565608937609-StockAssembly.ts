import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class StockAssembly1565608937609 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      const table = new Table({
        name: 'stock_assemblies_assembly',
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
            name: 'assemblyId',
            type: 'varchar',
            length: '255',
            isPrimary: true,
            isNullable: false,
          }, {
            name: 'StockAssemblyQty',
            type: 'varchar',
            length: '255',
            isPrimary: true,
            isNullable: false,
            default: 1,
          }, {
            name: 'StockAssemblyPrice',
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
      await queryRunner.dropTable('stock_assemblies_assembly');
    }

}
