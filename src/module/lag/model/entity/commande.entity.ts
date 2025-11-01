import { Column, PrimaryColumn, Entity, ManyToOne, JoinColumn} from "typeorm";
import { ulid } from "ulid";
import { StatutCommande } from "./enum";
import { Client } from "./client.entity";


@Entity()
export class Commande {
    @PrimaryColumn('varchar', { length:26, default: () => `'${ulid()}'` })
    id_commande : string;

    @Column({nullable: false})
    date_commande: Date;

    @Column({nullable: true})
    deadline: Date;

    @Column({nullable: true})
    produit: string;
    
    @Column({nullable: true})
    description: string;

    @Column({nullable: true})
    fichiers_joints: string;

    @Column({default: false})
    CGV_acceptée: boolean;

    @Column({default: false})
    newsletter_acceptée: boolean;

    @Column({nullable: false, default: StatutCommande.EN_ATTENTE_INFORMATION})
    statut_commande: StatutCommande;


    @ManyToOne(() => Client, (client) => client.id_client)
    @JoinColumn({name: 'id_client'})
    client: Client;
}