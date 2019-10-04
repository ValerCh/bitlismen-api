import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class ModuleTag1565180478423 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      const table = new Table({
        name: 'module_tags_tag',
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
            name: 'tagId',
            type: 'varchar',
            length: '255',
            isPrimary: true,
            isNullable: false,
          },
        ],
      });
      await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.dropTable('module_tags_tag');
    }

}
