import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class AssemblyComponent1561121305971 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: 'assembly_components_component',
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
          name: 'assemblyId',
          type: 'int',
          length: '255',
          isPrimary: true,
          isNullable: false,
        }, {
          name: 'componentId',
          type: 'int',
          length: '255',
          isPrimary: true,
          isNullable: false,
        }, {
          name: 'AssemblyComponentQty',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
          default: 1,
        },
      ],
    });
    await queryRunner.createTable(table);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('assembly_components_component');
  }

}
