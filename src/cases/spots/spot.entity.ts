import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

    @Entity()
    export class Spot {
        @PrimaryGeneratedColumn('uuid')
        id: string;

        @Column({length: 60, nullable: false})
        name: string;

        @Column({type: 'boolean', default: true})
        active: boolean;
    }