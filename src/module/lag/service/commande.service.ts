import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commande, Client, Gravure, Personnalisation, Support } from '../model/entity';
import { AjouterCommandePayload } from '../model/payload';
import { StatutCommande } from '../model/entity/enum';
import { ulid } from 'ulid';

@Injectable()
export class CommandeService {
    constructor(
        @InjectRepository(Commande) private readonly commandeRepository: Repository<Commande>,
        @InjectRepository(Client) private readonly clientRepository: Repository<Client>,
        @InjectRepository(Gravure) private readonly gravureRepository: Repository<Gravure>,
        @InjectRepository(Personnalisation) private readonly personnalisationRepository: Repository<Personnalisation>,
        @InjectRepository(Support) private readonly supportRepository: Repository<Support>
    ) {}

    async ajouterCommande(payload: AjouterCommandePayload): Promise<Commande> {
        // Créer ou récupérer le client
        let client: Client | null = null;
        
        if (payload.coordonnees_contact?.mail) {
            client = await this.clientRepository.findOne({
                where: { mail: payload.coordonnees_contact.mail }
            });
        }

        if (!client) {
            // Générer un ID unique manuellement
            const clientId = ulid();
            const mailValue = payload.coordonnees_contact?.mail ?? `client-${Date.now()}-${Math.random().toString(36).substring(7)}@sans-email.com`;
            
            // Vérifier si un client avec cet email existe déjà (cas où l'email généré existe par hasard)
            let existingClient = await this.clientRepository.findOne({
                where: { mail: mailValue }
            });
            
            if (!existingClient) {
                client = new Client();
                client.id_client = clientId;
                client.nom = payload.coordonnees_contact?.nom ?? null;
                client.prénom = payload.coordonnees_contact?.prenom ?? null;
                client.mail = mailValue;
                client.téléphone = payload.coordonnees_contact?.telephone ?? '0000000000';
                client.adresse = payload.coordonnees_contact?.adresse ?? null;
                client.tva = payload.coordonnees_contact?.tva ?? null;
                
                try {
                    client = await this.clientRepository.save(client);
                } catch (error: any) {
                    // Si erreur de duplication de clé, essayer de récupérer le client existant
                    if (error.code === '23505' && error.constraint === 'PK_83f4571a0e37e3822fff36d6b8a') {
                        // L'ID existe déjà, générer un nouveau et réessayer
                        client.id_client = ulid();
                        client = await this.clientRepository.save(client);
                    } else {
                        throw error;
                    }
                }
            } else {
                client = existingClient;
            }
        } else {
            // Mettre à jour les informations du client si elles ont changé
            if (payload.coordonnees_contact?.nom) {
                client.nom = payload.coordonnees_contact.nom;
            }
            if (payload.coordonnees_contact?.prenom) {
                client.prénom = payload.coordonnees_contact.prenom;
            }
            if (payload.coordonnees_contact?.telephone) {
                client.téléphone = payload.coordonnees_contact.telephone;
            }
            if (payload.coordonnees_contact?.adresse !== undefined) {
                client.adresse = payload.coordonnees_contact.adresse ?? null;
            }
            if (payload.coordonnees_contact?.tva !== undefined) {
                client.tva = payload.coordonnees_contact.tva ?? null;
            }
            client = await this.clientRepository.save(client);
        }

        // Créer la commande
        const commande = new Commande();
        commande.id_commande = ulid(); // Générer l'ID manuellement
        commande.produit = payload.nom_commande;
        commande.deadline = payload.deadline ? new Date(payload.deadline) : null;
        commande.date_commande = new Date();
        commande.description = payload.description_projet ?? null;
        commande.fichiers_joints = payload.fichiers_joints && payload.fichiers_joints.length > 0 ? payload.fichiers_joints.join(',') : null;
        commande.statut_commande = StatutCommande.EN_ATTENTE_INFORMATION;
        commande.client = client;
        commande.CGV_acceptée = false;
        commande.newsletter_acceptée = false;

        let commandeSauvegardee: Commande;
        try {
            commandeSauvegardee = await this.commandeRepository.save(commande);
        } catch (error: any) {
            // Si erreur de duplication de clé, générer un nouvel ID et réessayer
            if (error.code === '23505' && error.constraint === 'PK_dc8b0018d21d1d1563e04643da9') {
                commande.id_commande = ulid();
                commandeSauvegardee = await this.commandeRepository.save(commande);
            } else {
                throw error;
            }
        }

        // Créer la gravure associée
        const gravure = new Gravure();
        gravure.id_gravure = ulid(); // Générer l'ID manuellement
        gravure.date_gravure = new Date();
        gravure.commande = commandeSauvegardee;
        let gravureSauvegardee: Gravure;
        try {
            gravureSauvegardee = await this.gravureRepository.save(gravure);
        } catch (error: any) {
            if (error.code === '23505') {
                gravure.id_gravure = ulid();
                gravureSauvegardee = await this.gravureRepository.save(gravure);
            } else {
                throw error;
            }
        }

        // Créer le support
        const support = new Support();
        support.id_support = ulid(); // Générer l'ID manuellement
        support.nom_support = payload.support || 'CP 3,6mm Méranti';
        support.dimensions = payload.dimensions_souhaitees ?? null;
        support.gravure = gravureSauvegardee;
        try {
            await this.supportRepository.save(support);
        } catch (error: any) {
            if (error.code === '23505') {
                support.id_support = ulid();
                await this.supportRepository.save(support);
            } else {
                throw error;
            }
        }

        // Créer la personnalisation
        const personnalisation = new Personnalisation();
        personnalisation.id_personnalisation = ulid(); // Générer l'ID manuellement
        // Le texte est obligatoire dans l'entité, donc on utilise une valeur par défaut si vide
        personnalisation.texte = payload.texte_personnalisation || '';
        personnalisation.police = payload.police_ecriture ?? null;
        // Convertir le tableau de couleurs en format simple-array pour TypeORM
        personnalisation.couleur = payload.couleur && payload.couleur.length > 0 ? payload.couleur : null;
        personnalisation.gravure = gravureSauvegardee;
        try {
            await this.personnalisationRepository.save(personnalisation);
        } catch (error: any) {
            if (error.code === '23505') {
                personnalisation.id_personnalisation = ulid();
                await this.personnalisationRepository.save(personnalisation);
            } else {
                throw error;
            }
        }

        return commandeSauvegardee;
    }

    async getAllCommandes(): Promise<Commande[]> {
        return await this.commandeRepository.find({
            relations: ['client'],
            order: {
                date_commande: 'DESC'
            }
        });
    }
}
