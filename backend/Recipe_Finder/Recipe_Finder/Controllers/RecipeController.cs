using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Recipe_Finder.Helpers;

namespace Recipe_Finder.Controllers;
[Route("api/[controller]")]
[ApiController]
public class RecipeController : ControllerBase
{
    private readonly RecipeService _service;

    public RecipeController(RecipeService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetRecipe(string name, bool isVegan, int number)
    {
        var recipe = await _service.FindRecipe(name, isVegan, number);

        return Ok(recipe);
    }


    [HttpGet("id")]
    public async Task<IActionResult> GetRecipeInfo(int id)
    {
        var recipe = await _service.FindRecipeInfo(id);

        return Ok(recipe);
    }
}
