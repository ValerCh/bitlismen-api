import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class OpportunityService1561461456667 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: 'opportunity_services_services',
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
          name: 'servicesId',
          type: 'varchar',
          length: '255',
          isPrimary: true,
          isNullable: false,
        }, {
          name: 'OpportunityServiceQty',
          type: 'varchar',
          length: '255',
          isPrimary: true,
          isNullable: false,
          default: 1,
        }, {
          name: 'OpportunityServiceSellingPriceUSD',
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
    await queryRunner.dropTable('opportunity_services_services');
  }

}
