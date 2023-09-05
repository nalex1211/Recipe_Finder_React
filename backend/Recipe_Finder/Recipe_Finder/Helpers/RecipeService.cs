using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Xml.Linq;

namespace Recipe_Finder.Helpers;

public class RecipeService
{
    private readonly IConfiguration _configuration;
    private readonly HttpClient _client;

    public RecipeService(IConfiguration configuration, HttpClient client)
    {
        _configuration = configuration;
        _client = client;
    }

    public async Task<string> FindRecipe(string name, bool isVegan, int number)
    {
        var apiKey = _configuration["ApiKey"];

        var url = $"https://api.spoonacular.com/recipes/complexSearch?apiKey={apiKey}&query={name}&number={number}";

        if (isVegan)
        {
            url += "&diet=vegan";
        }

        var response = await _client.GetAsync(url);

        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();

            var result = JToken.Parse(content).ToString(Formatting.Indented);
            return result;
        }
        return null;
    }

    public async Task<string> FindRecipeInfo(int id)
    {
        var apiKey = _configuration["ApiKey"];

        var url = $"https://api.spoonacular.com/recipes/{id}/information?apiKey={apiKey}";

        var response = await _client.GetAsync(url);

        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            var result = JToken.Parse(content).ToString(Formatting.Indented);
            return result;
        }
        return null;
    }
}
