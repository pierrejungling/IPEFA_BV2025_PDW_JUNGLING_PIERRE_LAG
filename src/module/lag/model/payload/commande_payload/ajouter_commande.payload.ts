import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsEmail, IsArray, IsDateString, IsString, Length } from 'class-validator';
import { Couleur } from '../../entity/enum';

export class CoordonneesContactPayload {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @Length(0, 50)
    nom?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @Length(0, 50)
    prenom?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @Length(0, 15)
    telephone?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEmail()
    mail?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @Length(0, 100)
    adresse?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @Length(0, 20)
    tva?: string;
}

export class AjouterCommandePayload {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(1, 100)
    nom_commande: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    deadline?: string;

    @ApiProperty({ type: () => CoordonneesContactPayload, required: false })
    @IsOptional()
    coordonnees_contact?: CoordonneesContactPayload;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description_projet?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    dimensions_souhaitees?: string;

    @ApiProperty({ type: [String], enum: Couleur })
    @IsOptional()
    @IsArray()
    couleur?: Couleur[];

    @ApiProperty()
    @IsOptional()
    @IsString()
    support?: string; // Par défaut: "CP 3,6mm Méranti"

    @ApiProperty()
    @IsOptional()
    @IsString()
    police_ecriture?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    texte_personnalisation?: string;

    @ApiProperty({ type: [String] })
    @IsOptional()
    @IsArray()
    fichiers_joints?: string[]; // URLs ou chemins des fichiers
}
