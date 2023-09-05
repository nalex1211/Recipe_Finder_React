import React, { useState } from "react";

const Recipe = () => {
	const [recipeName, setRecipe] = useState("");
	const [data, setData] = useState(null);
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isVegan, setIsVegan] = useState(false);
	const [numberOfRecipes, setnumberOfRecipes] = useState("");

	const url = `https://recipefind.azurewebsites.net/api/Recipe?name=${recipeName}${isVegan ? "&isVegan=true" : ""}&number=${numberOfRecipes}`;

	const fetchRecipe = async () => {
		try {
			if (recipeName === "") {
				setData(null);
				setErrorMessage("Please enter the name of the dish!");
				return;
			}

			if (numberOfRecipes <= 0) {
				setData(null);
				setErrorMessage("Please enter a number greater than 0!");
				return;
			}
			setIsLoading(true);
			const response = await fetch(url);
			const recipeData = await response.json();

			if (recipeData.results.length === 0) {
				setData(null);
				setErrorMessage("No data for this dish");
				return;
			}
			setData(recipeData);
			setErrorMessage("");
		} catch (error) {
			console.log(error);
			setData(null);
			setErrorMessage("Something went wrong. Try again later.");
		} finally {
			setIsLoading(false);
		}
	};


	const handleSubmit = (event) => {
		event.preventDefault();
		fetchRecipe();
	};

	const handleDetailsClick = async (recipeId) => {
		try {
			const detailedUrl = `https://recipefind.azurewebsites.net/api/Recipe/id?id=${recipeId}`;
			const response = await fetch(detailedUrl);
			const detailedData = await response.json();
			const recipeUrl = detailedData.spoonacularSourceUrl;
			window.open(recipeUrl, "_blank");
		} catch (error) {
			console.log(error);
			setErrorMessage("Something went wrong. Try again later.");
		}
	};

	return (
		<div className="centered" style={{ marginTop: 75 }}>
			<h1>Recipe finder</h1>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<input
						className="form-control"
						type="text"
						placeholder="Dish name"
						value={recipeName}
						onChange={(event) => setRecipe(event.target.value)}
						style={{ whiteSpace: "nowrap", fontSize: 20 }}
					/>
				</div>
				<input
					placeholder="Number of recipes"
					type="text"
					className="form-control"
					onKeyPress={(event) => {
						const pattern = /[0-9]/;
						if (!pattern.test(event.key)) {
							event.preventDefault();
						}
					}}
					onChange={(event) => setnumberOfRecipes(event.target.value)}
				/>

				<div className="checkbox-group">
					<input
						type="checkbox"
						className="form-check-input"
						checked={isVegan}
						onChange={(event) => setIsVegan(event.target.checked)}
						style={{ whiteSpace: "nowrap", fontSize: 20 }}
					/>
					<label className="form-check-label">Vegan</label>
				</div>
				<div className="centered">
					<button className="btn btn-secondary mt-2" type="submit" style={{ whiteSpace: "nowrap", fontSize: 20 }}>
						Get recipes
					</button>
				</div>
			</form>

			{errorMessage && <p className="mt-2" style={{ fontSize: 20 }}>{errorMessage}</p>}

			{data && (
				<div>
					<h2 style={{ textAlign: "center" }}>List of {recipeName} recipes</h2>
					<div className="recipe-container">
						{data.results.map((result) => (
							<div key={result.id} className="recipe-card">
								<div className="recipe-image-container">
									<img src={result.image} alt={result.title} className="recipe-image" />
								</div>
								<h3 className="recipe-title">{result.title}</h3>
								<button className="btn btn-primary" onClick={() => handleDetailsClick(result.id)}>
									Details
								</button>
							</div>
						))}
					</div>
				</div>
			)}

			{isLoading && <p className="mt-2" style={{ fontSize: 20 }}>Loading...</p>}
		</div>
	);
};

export default Recipe;
