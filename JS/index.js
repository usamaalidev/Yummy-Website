"use strict";

// TODO: [1] loading animation.
// TODO: [2] check responsive design

$("document").ready(function () {
  // * Declaring Variables
  const sideBar = $("aside");
  const navBar = $("aside nav");
  const navBarWidth = navBar.outerWidth();
  const showHideMenu = $("#showHideMenu");
  const searchBtn = $("#search");
  const categoryBtn = $("#category");
  const areaBtn = $("#area");
  const ingredientsBtn = $("#ingredients");
  const contactBtn = $("#contact");
  const formRegex = {
    name: /^[a-zA-Z]+\s*[a-zA-Z]+$/,
    email: /^\w+@\w{2,10}\.\w+$/,
    phone: /^(\+2)?01[0125]\d{8}$/,
    age: /^[1-9][0-9]?$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
  };
  let meals;
  let categories;
  const body = document.body;

  function loadingBuilder(element = body) {
    const loadingContainer = document.createElement("div");
    loadingContainer.className = "loading";

    const loadingInner = document.createElement("div");
    loadingInner.classList.add("sk-folding-cube");

    const loadingIcon1 = document.createElement("div");
    loadingIcon1.classList.add("sk-cube1", "sk-cube");

    const loadingIcon2 = document.createElement("div");
    loadingIcon2.classList.add("sk-cube2", "sk-cube");

    const loadingIcon3 = document.createElement("div");
    loadingIcon3.classList.add("sk-cube3", "sk-cube");

    const loadingIcon4 = document.createElement("div");
    loadingIcon4.classList.add("sk-cube4", "sk-cube");

    loadingInner.appendChild(loadingIcon1);
    loadingInner.appendChild(loadingIcon2);
    loadingInner.appendChild(loadingIcon3);
    loadingInner.appendChild(loadingIcon4);

    loadingContainer.appendChild(loadingInner);

    element.prepend(loadingContainer);

    $(".sk-folding-cube").fadeOut(1000, function () {
      $(".loading").fadeOut(500, function () {
        $("body").css({ overflow: "auto" });
        $(".loading").remove();
      });
    });
  }

  loadingBuilder();

  sideBar.css("left", `${-navBarWidth}px`);
  const linkMarginBlock = $("nav ul li").css("margin-block");

  showHideMenu.click(toggleSideBar);

  function toggleSideBar() {
    if (sideBar.css("left") == "0px") {
      sideBar.animate({ left: -navBarWidth }, 500);
      showHideMenu.removeClass("fa-xmark").addClass("fa-bars");
      $("nav > ul li").animate(
        { marginBlock: linkMarginBlock, opacity: 0 },
        700
      );
    } else {
      sideBar.animate({ left: 0 }, 500);
      showHideMenu.removeClass("fa-bars").addClass("fa-xmark");
      $("nav ul li").animate({ marginBlock: "0px", opacity: 1 }, 700);
    }
  }

  async function getMealsData(file, query, userInput, loadingcontainer) {
    const initialResponse = await fetch(
      `https://www.themealdb.com/api/json/v1/1/${file}?${query}=${userInput}`
    );
    const initialData = await initialResponse.json();
    if (initialData.meals !== null) {
      displayMealData(initialData.meals);
    }
    return initialData;
  }

  getMealsData("search.php", "s", "");

  const container = document.getElementById("container");
  const row = document.createElement("div");
  row.classList.add("row", "gy-4");

  function displayMealData(mealsData) {
    for (let i = 0; i < mealsData.length; i++) {
      const mealName = document.createElement("h3");
      const mealNameText = document.createTextNode(mealsData[i].strMeal);
      mealName.appendChild(mealNameText);
      mealName.className = "meal-name";

      const mealInfo = document.createElement("div");
      mealInfo.className = "meal-info";

      mealInfo.appendChild(mealName);

      const mealImage = document.createElement("img");
      mealImage.setAttribute("src", `${mealsData[i].strMealThumb}`);
      mealImage.setAttribute("alt", `${mealsData[i].strMeal} Image`);
      mealImage.classList.add("w-100");

      const mealItem = document.createElement("div");
      mealItem.className = "meal";
      mealItem.setAttribute("data-meal-name", mealsData[i].strMeal);
      mealItem.appendChild(mealImage);
      mealItem.appendChild(mealInfo);

      const mealContainer = document.createElement("div");
      mealContainer.classList.add("col-lg-3", "col-md-6");
      mealContainer.appendChild(mealItem);

      row.appendChild(mealContainer);
    }
    container.appendChild(row);

    if (row.previousElementSibling) {
      if (row.previousElementSibling.classList.contains("search")) {
        loadingBuilder(row);
      }
    }

    meals = $(".meal");
    meals.click(showMealInfo);
  }

  function displayCategories(Categories) {
    for (let i = 0; i < Categories.length; i++) {
      const categoryName = document.createElement("h3");
      const categoryNameText = document.createTextNode(
        Categories[i].strCategory
      );
      categoryName.appendChild(categoryNameText);
      categoryName.className = "category-name";

      const categoryDescription = document.createElement("p");
      const categoryDescriptionText = document.createTextNode(
        Categories[i].strCategoryDescription.split(" ").splice(0, 15).join(" ")
      );
      categoryDescription.appendChild(categoryDescriptionText);
      categoryDescription.className = "category-description";

      const categoryInfo = document.createElement("div");
      categoryInfo.className = "category-info";

      categoryInfo.appendChild(categoryName);
      categoryInfo.appendChild(categoryDescription);

      const categoryImage = document.createElement("img");
      categoryImage.setAttribute("src", `${Categories[i].strCategoryThumb}`);
      categoryImage.setAttribute("alt", `${Categories[i].strCategory} Image`);
      categoryImage.classList.add("w-100");

      const categoryItem = document.createElement("div");
      categoryItem.className = "category";
      categoryItem.setAttribute("data-category-name", categoryName.textContent);
      categoryItem.appendChild(categoryImage);
      categoryItem.appendChild(categoryInfo);

      const categoryContainer = document.createElement("div");
      categoryContainer.classList.add("col-lg-3", "col-md-6");
      categoryContainer.appendChild(categoryItem);

      row.appendChild(categoryContainer);
    }
    container.appendChild(row);
    categories = $(".category");
    categories.click(async function (e) {
      const categoryQuery = $(e.currentTarget).data("categoryName");
      row.innerHTML = "";
      const categoryMeals = await getMealsData(
        "filter.php",
        "c",
        categoryQuery,
        body
      );
    });
  }

  async function getMealDetails(file, query, userInput) {
    const initialResponse = await fetch(
      `https://www.themealdb.com/api/json/v1/1/${file}?${query}=${userInput}`
    );
    loadingBuilder(body);
    const initialData = await initialResponse.json();
    return initialData;
  }

  async function showMealInfo(e) {
    const currentMeal = $(e.currentTarget).data("meal-name");
    const mealDetails = await getMealDetails("search.php", "s", currentMeal);
    container.innerHTML = "";
    row.innerHTML = "";

    const mealImage = document.createElement("img");
    mealImage.src = mealDetails.meals[0].strMealThumb;
    mealImage.alt = `${mealDetails.meals[0].strMeal} Image`;
    mealImage.className = "w-100";

    const mealName = document.createElement("h3");
    mealName.textContent = mealDetails.meals[0].strMeal;
    mealName.className = "meal-name";

    const mealBrief = document.createElement("div");
    mealBrief.classList.add("col-lg-4", "meal-brief");
    mealBrief.appendChild(mealImage);
    mealBrief.appendChild(mealName);

    const instructionHeading = document.createElement("h3");
    instructionHeading.textContent = "Instructions";

    const instructionParagraph = document.createElement("p");
    instructionParagraph.textContent = mealDetails.meals[0].strInstructions;

    const area = document.createElement("div");
    area.className = "area";

    const areaHeading = document.createElement("h4");
    areaHeading.textContent = "Area:";

    const areaIcon = document.createElement("i");
    areaIcon.classList.add("fa-solid", "fa-location-dot", "fa-fw", "me-2");

    areaHeading.prepend(areaIcon);

    const areaSpan = document.createElement("span");
    areaSpan.textContent = mealDetails.meals[0].strArea;

    area.appendChild(areaHeading);
    area.appendChild(areaSpan);

    const category = document.createElement("div");
    category.className = "category";

    const categoryHeading = document.createElement("h4");
    categoryHeading.textContent = "Category:";

    const categoryIcon = document.createElement("i");
    categoryIcon.classList.add("fa-solid", "fa-tag", "fa-fw", "me-2");

    categoryHeading.prepend(categoryIcon);

    const categorySpan = document.createElement("span");
    categorySpan.textContent = mealDetails.meals[0].strCategory;

    category.appendChild(categoryHeading);
    category.appendChild(categorySpan);

    const recipes = document.createElement("div");
    recipes.className = "recipes";

    const recipesHeading = document.createElement("h4");
    recipesHeading.textContent = "Recipes:";

    const recipesIcon = document.createElement("i");
    recipesIcon.classList.add("fa-solid", "fa-utensils", "fa-fw", "me-2");

    recipesHeading.prepend(recipesIcon);
    recipes.appendChild(recipesHeading);

    const mealDetailsMap = new Map(Object.entries(mealDetails.meals[0]));

    for (let i = 1; i <= mealDetailsMap.size; i++) {
      let currentMeasure = mealDetailsMap.get(`strMeasure${i}`);
      if (
        currentMeasure !== null &&
        currentMeasure !== "" &&
        currentMeasure !== undefined &&
        currentMeasure !== " "
      ) {
        const recipesSpan = document.createElement("span");
        recipesSpan.textContent = `${currentMeasure} ${mealDetailsMap.get(
          `strIngredient${i}`
        )}`;
        recipes.appendChild(recipesSpan);
      }
    }

    let availableTags = mealDetailsMap.get("strTags");
    let tags;
    if (
      availableTags !== null &&
      availableTags !== "" &&
      availableTags !== " " &&
      availableTags !== undefined
    ) {
      tags = document.createElement("div");
      tags.className = "tags";

      const tagsHeading = document.createElement("h4");
      tagsHeading.textContent = "Tags:";

      const tagsIcon = document.createElement("i");
      tagsIcon.classList.add("fa-solid", "fa-hashtag", "fa-fw", "me-2");

      tagsHeading.prepend(tagsIcon);
      tags.appendChild(tagsHeading);

      const tagsArr = availableTags.split(",");
      for (const tag of tagsArr) {
        const tagSpan = document.createElement("span");
        tagSpan.textContent = tag;
        tags.appendChild(tagSpan);
      }
    }

    const sourceBtn = document.createElement("button");
    sourceBtn.classList.add("btn", "btn-source");

    const sourceIcon = document.createElement("i");
    sourceIcon.classList.add("fa-solid", "fa-circle-info", "me-2");

    const sourceLink = document.createElement("a");
    sourceLink.textContent = "Source";
    sourceLink.href = mealDetails.meals[0].strSource;

    sourceBtn.appendChild(sourceIcon);
    sourceBtn.appendChild(sourceLink);

    const youtubeBtn = document.createElement("button");
    youtubeBtn.classList.add("btn", "btn-youtube");

    const youtubeIcon = document.createElement("i");
    youtubeIcon.classList.add("fa-brands", "fa-youtube", "me-2");

    const youtubeLink = document.createElement("a");
    youtubeLink.textContent = "Youtube";
    youtubeLink.href = mealDetails.meals[0].strYoutube;

    youtubeBtn.appendChild(youtubeIcon);
    youtubeBtn.appendChild(youtubeLink);

    const sources = document.createElement("div");
    sources.className = "sources";

    sources.appendChild(sourceBtn);
    sources.appendChild(youtubeBtn);

    const mealDetailsContainer = document.createElement("div");
    mealDetailsContainer.classList.add("meal-details", "col-lg-8");
    mealDetailsContainer.appendChild(instructionHeading);
    mealDetailsContainer.appendChild(instructionParagraph);
    mealDetailsContainer.appendChild(area);
    mealDetailsContainer.appendChild(category);
    mealDetailsContainer.appendChild(recipes);
    if (tags !== undefined) {
      mealDetailsContainer.appendChild(tags);
    }
    mealDetailsContainer.appendChild(sources);

    row.appendChild(mealBrief);
    row.appendChild(mealDetailsContainer);
    container.appendChild(row);
  }

  searchBtn.click(function () {
    toggleSideBar();
    container.innerHTML = "";
    row.innerHTML = "";
    const searchByNameInput = document.createElement("input");
    searchByNameInput.setAttribute("placeholder", "Search By Name");
    searchByNameInput.classList.add("form-control", "search-by-name");

    const searchByFirstLetter = document.createElement("input");
    searchByFirstLetter.setAttribute("placeholder", "Search By First Letter");
    searchByFirstLetter.classList.add("form-control", "search-by-first-letter");
    searchByFirstLetter.setAttribute("maxlength", "1");

    const rowSearch = document.createElement("div");
    rowSearch.classList.add("row", "gy-4", "search");
    rowSearch.appendChild(searchByNameInput);
    rowSearch.appendChild(searchByFirstLetter);

    container.prepend(rowSearch);

    searchByNameInput.addEventListener("keyup", function () {
      row.innerHTML = "";
      getMealsData("search.php", "s", `${searchByNameInput.value}`);
    });

    searchByFirstLetter.addEventListener("keyup", function () {
      row.innerHTML = "";
      getMealsData(
        "search.php",
        "f",
        `${searchByFirstLetter.value.split("")[0]}`
      );
    });

    searchByNameInput.addEventListener("blur", function () {
      searchByNameInput.value = "";
    });

    searchByFirstLetter.addEventListener("blur", function () {
      searchByFirstLetter.value = "";
    });
  });

  // ! Handling Repeated Functions

  async function getCategories(file) {
    const initialResponse = await fetch(
      `https://www.themealdb.com/api/json/v1/1/${file}`
    );
    loadingBuilder();
    const initialData = await initialResponse.json();
    return initialData;
  }

  categoryBtn.click(async function () {
    toggleSideBar();
    container.innerHTML = "";
    row.innerHTML = "";
    const allCategories = await getCategories("categories.php");
    displayCategories(allCategories.categories);
    container.appendChild(row);
  });

  async function getArea(file, query, userInput) {
    const initialResponse = await fetch(
      `https://www.themealdb.com/api/json/v1/1/${file}?${query}=${userInput}`
    );
    loadingBuilder();
    const initialData = await initialResponse.json();
    return initialData;
  }

  function areaBuilder(areas) {
    for (let area of areas) {
      const areaIcon = document.createElement("i");
      areaIcon.classList.add("fa-solid", "fa-house", "area-icon");

      const areaName = document.createElement("h3");
      areaName.setAttribute("class", "area-name");
      areaName.textContent = area.strArea;

      const areaContainer = document.createElement("div");
      areaContainer.classList.add("area-container", "col-lg-3", "col-md-6");
      areaContainer.setAttribute("data-area", areaName.textContent);
      areaContainer.appendChild(areaIcon);
      areaContainer.appendChild(areaName);
      areaContainer.addEventListener("click", showAreaMeals);

      row.appendChild(areaContainer);
    }
  }

  areaBtn.click(async function () {
    toggleSideBar();
    container.innerHTML = "";
    row.innerHTML = "";
    const allAreas = await getArea("list.php", "a", "list");
    areaBuilder(allAreas.meals);
    container.appendChild(row);
  });

  async function showAreaMeals(e) {
    container.innerHTML = "";
    row.innerHTML = "";
    const area = e.currentTarget.dataset.area;
    const mealsOfArea = await getArea("filter.php", "a", area);
    displayMealData(mealsOfArea.meals);
    container.appendChild(row);
  }

  // Ingredients

  function ingredientsBuilder(ingredients) {
    for (let i = 0; i < 20; i++) {
      const ingredientIcon = document.createElement("i");
      ingredientIcon.classList.add(
        "fa-solid",
        "fa-bowl-food",
        "ingredient-icon"
      );

      const ingredientName = document.createElement("h3");
      ingredientName.setAttribute("class", "ingredient-name");
      ingredientName.textContent = ingredients[i].strIngredient;

      const ingredientDescription = document.createElement("p");
      ingredientDescription.classList.add(
        "ingredient-description",
        "text-center"
      );
      ingredientDescription.textContent = ingredients[i].strDescription
        .split(" ")
        .splice(0, 12)
        .join(" ");

      const ingredientContainer = document.createElement("div");
      ingredientContainer.classList.add(
        "ingredient-container",
        "col-lg-3",
        "col-md-6"
      );
      ingredientContainer.setAttribute(
        "data-ingredient",
        ingredientName.textContent
      );
      ingredientContainer.appendChild(ingredientIcon);
      ingredientContainer.appendChild(ingredientName);
      ingredientContainer.appendChild(ingredientDescription);
      ingredientContainer.addEventListener("click", showIngradientMeals);

      row.appendChild(ingredientContainer);
    }
  }

  ingredientsBtn.click(async function () {
    toggleSideBar();
    container.innerHTML = "";
    row.innerHTML = "";
    const allIngredients = await getArea("list.php", "i", "list");
    ingredientsBuilder(allIngredients.meals);
    container.appendChild(row);
  });

  async function showIngradientMeals(e) {
    container.innerHTML = "";
    row.innerHTML = "";
    const ingredient = e.currentTarget.dataset.ingredient;
    const mealsOfIngredient = await getArea("filter.php", "i", ingredient);
    displayMealData(mealsOfIngredient.meals);
    container.appendChild(row);
  }

  contactBtn.click((e) => {
    toggleSideBar();
    container.innerHTML = "";
    row.innerHTML = "";

    const contactUsHeading = document.createElement("h2");
    contactUsHeading.textContent = "Contact Us";

    const formContainer = document.createElement("div");
    formContainer.className = "form";

    // name Container
    const nameContainer = document.createElement("div");
    nameContainer.className = "name";

    const nameInput = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("placeholder", "ex: Usama");
    nameInput.setAttribute("id", "name");
    nameInput.setAttribute("class", "form-control");

    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Your Name";
    nameLabel.setAttribute("for", "name");

    nameContainer.appendChild(nameLabel);
    nameContainer.appendChild(nameInput);

    // email Container
    const emailContainer = document.createElement("div");
    emailContainer.className = "email";

    const emailInput = document.createElement("input");
    emailInput.setAttribute("type", "email");
    emailInput.setAttribute("placeholder", "ex: usamaali.route@gmail.com");
    emailInput.setAttribute("id", "email");
    emailInput.setAttribute("class", "form-control");

    const emailLabel = document.createElement("label");
    emailLabel.textContent = "Your Email";
    emailLabel.setAttribute("for", "email");

    emailContainer.appendChild(emailLabel);
    emailContainer.appendChild(emailInput);

    // phone Container
    const phoneContainer = document.createElement("div");
    phoneContainer.className = "phone";

    const phoneInput = document.createElement("input");
    phoneInput.setAttribute("type", "text");
    phoneInput.setAttribute("placeholder", "ex: 01097514862");
    phoneInput.setAttribute("id", "phone");
    phoneInput.setAttribute("class", "form-control");

    const phoneLabel = document.createElement("label");
    phoneLabel.textContent = "Your Phone";
    phoneLabel.setAttribute("for", "phone");

    phoneContainer.appendChild(phoneLabel);
    phoneContainer.appendChild(phoneInput);

    // age Container
    const ageContainer = document.createElement("div");
    ageContainer.className = "age";

    const ageInput = document.createElement("input");
    ageInput.setAttribute("type", "number");
    ageInput.setAttribute("placeholder", "ex: 23");
    ageInput.setAttribute("id", "age");
    ageInput.setAttribute("class", "form-control");

    const ageLabel = document.createElement("label");
    ageLabel.textContent = "Your Age";
    ageLabel.setAttribute("for", "age");

    ageContainer.appendChild(ageLabel);
    ageContainer.appendChild(ageInput);

    // password Container
    const passwordContainer = document.createElement("div");
    passwordContainer.className = "password";

    const passwordInput = document.createElement("input");
    passwordInput.setAttribute("type", "password");
    passwordInput.setAttribute("id", "password");
    passwordInput.setAttribute("class", "form-control");

    const passwordLabel = document.createElement("label");
    passwordLabel.textContent = "Password";
    passwordLabel.setAttribute("for", "password");

    passwordContainer.appendChild(passwordLabel);
    passwordContainer.appendChild(passwordInput);

    // confirm Container
    const confirmContainer = document.createElement("div");
    confirmContainer.className = "confirm";

    const confirmInput = document.createElement("input");
    confirmInput.setAttribute("type", "password");
    confirmInput.setAttribute("id", "confirm");
    confirmInput.setAttribute("class", "form-control");

    const confirmLabel = document.createElement("label");
    confirmLabel.textContent = "Confirm Password";
    confirmLabel.setAttribute("for", "confirm");

    confirmContainer.appendChild(confirmLabel);
    confirmContainer.appendChild(confirmInput);

    const submitBtn = document.createElement("button");
    submitBtn.classList.add("btn", "btn-source", "rounded-pill");
    submitBtn.setAttribute("disabled", "true");
    submitBtn.textContent = "Submit";

    formContainer.appendChild(contactUsHeading);
    formContainer.appendChild(nameContainer);
    formContainer.appendChild(emailContainer);
    formContainer.appendChild(phoneContainer);
    formContainer.appendChild(ageContainer);
    formContainer.appendChild(passwordContainer);
    formContainer.appendChild(confirmContainer);
    formContainer.appendChild(submitBtn);

    row.appendChild(contactUsHeading);
    row.appendChild(formContainer);

    container.appendChild(row);

    const inputs = document.querySelectorAll(".form input");

    for (let input of inputs) {
      input.addEventListener("keyup", function () {
        if (input.id !== "confirm") {
          validateInput(this, formRegex[`${this.id}`]);
        } else {
          isConfirm(passwordInput, confirmInput);
        }
        const validInputs = document.querySelectorAll(".is-valid");
        if (validInputs.length == 6) {
          submitBtn.removeAttribute("disabled");
        } else {
          submitBtn.setAttribute("disabled", "true");
        }
      });
    }
  });

  function validateInput(input, regex) {
    let value = input.value;
    if (regex.test(value)) {
      input.classList.add("is-valid");
      input.classList.remove("is-invalid");
    } else {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
    }
  }

  function isConfirm(passInput, confirmInput) {
    if (confirmInput.value == passInput.value) {
      confirmInput.classList.add("is-valid");
      confirmInput.classList.remove("is-invalid");
    } else {
      confirmInput.classList.add("is-invalid");
      confirmInput.classList.remove("is-valid");
    }
  }
});
