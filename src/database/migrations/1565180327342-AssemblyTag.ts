import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class AssemblyTag1565180327342 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      const table = new Table({
        name: 'assembly_tags_tag',
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
      await queryRunner.dropTable('assembly_tags_tag');
    }

}
