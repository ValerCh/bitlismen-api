import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class ServiceTag1565179933546 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      const table = new Table({
        name: 'services_tags_tag',
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
            name: 'servicesId',
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
      await queryRunner.dropTable('services_tags_tag');
    }

}
