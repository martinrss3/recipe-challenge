import { Field, ObjectType, Int } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "./Category";
import { User } from "./User";

@Entity()
@ObjectType()
export class Recipe extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  description!: string;

  @Field()
  @Column()
  ingredients!: string;

  @Field()
  @Column()
  userId: number;

  @Field()
  @Column()
  categoryId: number;

  @ManyToOne(() => User, (user) => user.recipes)
  user: User;

  @ManyToOne(() => Category, (category) => category.recipes)
  category: Category;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
