import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class RolePermissions1565266989699 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      const table = new Table({
        name: 'role_permissions_permissions',
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
            name: 'roleId',
            type: 'varchar',
            length: '255',
            isPrimary: true,
            isNullable: false,
          }, {
            name: 'permissionsId',
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
      await queryRunner.dropTable('role_permissions_permissions');
    }

}
