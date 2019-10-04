import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class Rols1561640601601 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: 'role',
      columns: [
        {
          name: 'id',
          type: 'varchar',
          length: '255',
          isPrimary: true,
          isNullable: false,
        }, {
          name: 'role_internal_name',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'role_display_name',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        }, {
          name: 'created_at',
          type: 'datetime',
          isPrimary: false,
          default: 'CURRENT_TIMESTAMP',
        }, {
          name: 'updated_at',
          type: 'datetime',
          isPrimary: false,
          default: 'CURRENT_TIMESTAMP',
        },
      ],
    });
    await queryRunner.createTable(table);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('role');
  }

}
