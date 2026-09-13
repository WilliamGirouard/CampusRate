import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlaceCategoryEnum } from '../enum/place.category.enum.js';
import { PlaceStatusEnum } from '../enum/place.status.enum.js';

@Entity()
export class Building {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: PlaceCategoryEnum })
  category: PlaceCategoryEnum;

  @Column()
  address: string;

  @Column({ type: 'simple-json', default: [] })
  services: string[];

  @Column({
    type: 'enum',
    enum: PlaceStatusEnum,
    default: PlaceStatusEnum.ACTIVE,
  })
  status: PlaceStatusEnum;

  @Column({ type: 'float', nullable: true })
  averageRating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
