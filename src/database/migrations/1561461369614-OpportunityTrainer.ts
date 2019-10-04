import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class OpportunityTrainer1561461369614 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: 'opportunity_trainers_trainer',
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
          name: 'opportunityId',
          type: 'varchar',
          length: '255',
          isPrimary: true,
          isNullable: false,
        }, {
          name: 'trainerId',
          type: 'varchar',
          length: '255',
          isPrimary: true,
          isNullable: false,
        }, {
          name: 'OpportunityTrainerQty',
          type: 'varchar',
          length: '255',
          isPrimary: true,
          isNullable: false,
          default: 1,
        }, {
          name: 'OpportunityTrainerSellingPrice',
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
    await queryRunner.dropTable('opportunity_trainers_trainer');
  }

}
