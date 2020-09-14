import { Resolver, Query, Mutation, Arg, InputType, Field } from "type-graphql";
import { Category } from "../entities/Category";

@InputType()
class CreateCategoryInput {
  @Field()
  name: string;
}

@InputType()
class UpdateCategoryInput {
  @Field({ nullable: true })
  name?: string;
}

@Resolver()
export class CategoryResolver {
  @Query(() => [Category])
  getCategories() {
    return Category.find();
  }

  @Query(() => Category)
  getOneCategory(@Arg("id") id: number) {
    return Category.findOne({ where: { id } });
  }

  @Mutation(() => Category)
  async createCategory(@Arg("data") data: CreateCategoryInput) {
    const category = Category.create(data);
    await category.save();
    return category;
  }

  @Mutation(() => Category)
  async updateCategory(
    @Arg("id") id: number,
    @Arg("data") data: UpdateCategoryInput
  ) {
    const category = await Category.findOne({ where: { id } });
    if (!category) throw new Error("Category not found!");
    Object.assign(category, data);
    await category.save();
    return category;
  }

  @Mutation(() => Boolean)
  async deleteCategory(@Arg("id") id: number) {
    const category = await Category.findOne({ where: { id } });
    if (!category) throw new Error("Category not found!");
    await category.remove();
    return true;
  }
}
