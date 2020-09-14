import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Recipe } from "../entities/Recipe";

@InputType()
class RecipeInput {
  @Field()
  name: string;
  @Field()
  description: string;
  @Field()
  ingredients: string;
  @Field()
  categoryId: number;
}

@Resolver()
export class RecipeResolver {
  @Query(() => [Recipe])
  getRecipes() {
    return Recipe.find();
  }

  @Query(() => Recipe)
  getOneRecipe(@Arg("id") id: string) {
    return Recipe.findOne({ where: { id } });
  }

  // @Mutation(() => Recipe)
  // async createRecipe(@Arg("data") data: CreateRecipeInput) {
  //   const recipe = Recipe.create(data);
  //   await recipe.save();
  //   return recipe;
  // }

  // @Mutation(() => Recipe)
  // @UseMiddleware(isAuthenticated)
  // async createRecipe(
  //   @Arg("input") input: RecipeInput,
  //   @Ctx() { req }: MyContext
  // ): Promise<Recipe> {
  //   return Recipe.create({
  //     ...input,
  //     userId: req.session.userId,
  //   }).save();
  // }

  @Mutation(() => Recipe)
  async updateRecipe(@Arg("id") id: string, @Arg("data") data: RecipeInput) {
    const recipe = await Recipe.findOne({ where: { id } });
    if (!recipe) throw new Error("Recipe not found!");
    Object.assign(recipe, data);
    await recipe.save();
    return recipe;
  }

  @Mutation(() => Boolean)
  async deleteRecipe(@Arg("id") id: string) {
    const recipe = await Recipe.findOne({ where: { id } });
    if (!recipe) throw new Error("Recipe not found!");
    await recipe.remove();
    return true;
  }
}
