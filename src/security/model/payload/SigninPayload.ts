import {ApiProperty} from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class SignInPayload {
    @ApiProperty()
    @IsNotEmpty() // USERNAME_IS_NOT_EMPTY
    username: string;

    @ApiProperty()
    @IsNotEmpty() // PASSWORD_IS_NOT_EMPTY
    password: string;

    @ApiProperty()
    @IsOptional() 
    googleHash: string;

    @ApiProperty()
    @IsOptional()
    facebookHash: string;

    @ApiProperty()
    socialLogin: boolean;
}