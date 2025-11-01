import { PrimaryColumn, Entity, Column } from "typeorm";
import { ulid } from "ulid";


@Entity()
export class Client {
    @PrimaryColumn('varchar', { length:26, default: () => `'${ulid()}'` })
    id_client : string;

    @Column({length: 50, nullable: true})
    nom: string;

    @Column({length: 50, nullable: true})
    prénom: string;

    @Column({length: 50, nullable: true})
    société: string;

    @Column({length: 50, nullable: false})
    mail: string;

    @Column({length: 15, nullable: false})
    téléphone: string;

    @Column({length: 100, nullable: true})
    adresse: string;
    
}