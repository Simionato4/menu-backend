import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Spot } from '../spots/spot.entity';
import { Order } from '../orders/entities/order-entity';

export enum GuestCheckStatus {
  OPENED = 'OPENED',
  CLOSED = 'CLOSED',
}

@Entity('guest-check')
export class GuestCheck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: GuestCheckStatus,
    default: GuestCheckStatus.OPENED,
  })
  status: GuestCheckStatus;

  @ManyToOne(() => Spot, { nullable: false })
  @JoinColumn({ name: 'spot_id' })
  spot: Spot;

  @OneToMany(() => Order, (order) => order.guestCheck)
  orders: Order[];
}
