import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommandeService } from '../service/commande.service';
import { AjouterCommandePayload } from '../model/payload';

@ApiBearerAuth('access-token')
@ApiTags('Commande')
@Controller('commande')
export class CommandeController {
    constructor(private readonly commandeService: CommandeService) {}

    @Post('ajouter')
    @ApiOperation({ summary: 'Ajouter une nouvelle commande' })
    async ajouterCommande(@Body() payload: AjouterCommandePayload) {
        return await this.commandeService.ajouterCommande(payload);
    }

    @Get('liste')
    @ApiOperation({ summary: 'Récupérer toutes les commandes' })
    async getAllCommandes() {
        return await this.commandeService.getAllCommandes();
    }
}
