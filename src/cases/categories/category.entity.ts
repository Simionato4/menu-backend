import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

    @Entity('categories')
    export class Category {
        @PrimaryGeneratedColumn('uuid')
        id: string;

        @Column({length: 60, nullable: false})
        name: string;

        @Column({type: 'boolean', default: true})
        active: boolean;

        @Column({type: 'text', nullable: true})
        icon?: string;

        @Column({name: 'display_order', type: 'integer', default: 0})
        displayOrder: number;
    }