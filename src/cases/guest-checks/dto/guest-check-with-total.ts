import { Spot } from '../../spots/spot.entity';
import { GuestCheckStatus } from '../guest-check.entity';

export interface GuestCheckWithTotal {
  id: string;
  createdAt: Date;
  status: GuestCheckStatus;
  spot: Spot;
  total: number;
}
