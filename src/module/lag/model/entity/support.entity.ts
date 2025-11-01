import { Column, PrimaryColumn, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ulid } from "ulid";
import { TypeMateriaux } from "./enum";
import { Gravure } from "./gravure.entity";


@Entity()
export class Support {
    @PrimaryColumn('varchar', { length:26, default: () => `'${ulid()}'` })
    id_support : string;

    @Column({nullable: false})
    nom_support: string;

    @Column({nullable: true})
    type_matériaux: TypeMateriaux;

    @Column({nullable: true})
    dimensions: string;

    @Column({nullable: true})
    prix_support: number;

    @ManyToOne(() => Gravure, (gravure) => gravure.id_gravure)
    @JoinColumn({name: 'id_gravure'})
    gravure: Gravure;

    
}