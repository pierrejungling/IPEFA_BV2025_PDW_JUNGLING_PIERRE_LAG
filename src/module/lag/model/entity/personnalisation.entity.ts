import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { ulid } from "ulid";
import { Gravure } from "./gravure.entity";


@Entity()
export class Personnalisation {
    @PrimaryColumn('varchar', { length:26, default: () => `'${ulid()}'` })
    id_personnalisation : string;

    @Column({nullable: false})
    texte: string;

    @Column({nullable: true})
    police: string;

    @Column({nullable: true})
    fichier_source: string;

    @Column({nullable: true})
    informations_supplémentaires: string;

    @ManyToOne(() => Gravure, (gravure) => gravure.id_gravure)
    @JoinColumn({name: 'id_gravure'})
    gravure: Gravure;
}