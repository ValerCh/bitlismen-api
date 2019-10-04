import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class TrainerTag1565180697772 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      const table = new Table({
        name: 'trainer_tags_tag',
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
            name: 'trainerId',
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
      await queryRunner.dropTable('trainer_tags_tag');
    }

}
