import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class ModuleComponent1561125991506 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: 'module_components_component',
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
          name: 'moduleId',
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
          name: 'ModuleComponentQty',
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
    await queryRunner.dropTable('module_components_component');
  }

}
