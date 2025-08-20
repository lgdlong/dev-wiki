import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Tutorial } from '../../tutorial/entities/tutorial.entity';
import { Tag } from '../../tags/entities/tag.entity';

@Entity({ name: 'tutorial_tags' })
@Index(['tutorialId', 'tagId'], { unique: true })
export class TutorialTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tutorial_id', nullable: false })
  tutorialId: number;

  @ManyToOne(() => Tutorial)
  @JoinColumn({ name: 'tutorial_id' })
  tutorial: Tutorial;

  @Column({ name: 'tag_id', nullable: false })
  tagId: number;

  @ManyToOne(() => Tag)
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
