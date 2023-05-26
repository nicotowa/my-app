import { useContext, useEffect, useReducer, useState } from "react";
import { ThemeContext } from "../../App";
import FavoriteItem from "../../components/favorite-item";
import RecipeItem from "../../components/recipe-item";
import Search from "../../components/search";
import './styles.css';
import { useCallback, useMemo } from "react";

const dummydata = 'dummydata';
const reducer = (state, action) => {

    switch (action.type) {
        case 'filterFavorites':
            console.log(action);
            return {
                ...state,
                filteredValue: action.value
            };

        default:
            return state;
    }
}

const initialState = {
    filteredValue: ''
}

const Homepage = () => {

    //loading state

    const [loadingState, setLoadingState] = useState(false);
    //save results that we received from api
    const [recipes, setRecipes] = useState([]);

    //favorites data state
    const [favorites, setFavorites] = useState([]);

    //state for api successfull or not
    const [apiCalledSuccess, setApiCalledSuccess] = useState(false);

    // use reducer funcionality
    const [filteredState, dispatch] = useReducer(reducer, initialState)

    const { theme } = useContext(ThemeContext)

    const getDataFromSearchComponent = (getData) => {
        //keep the loading state as true before calling api
        setLoadingState(true);

        //calling the api ?apiKey=7767bb3818bf4dd5b77055cfc3d3daff&query=${getData}

        async function getRecipes() {
            const apiResponse = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=7767bb3818bf4dd5b77055cfc3d3daff&query=${getData}`);
            const result = await apiResponse.json();

            const { results } = result;

            if (results && results.length > 0) {
                //set loading state as false 
                setLoadingState(false);
                //set the recipes state
                setRecipes(results);
                setApiCalledSuccess(true)
            }

        }

        getRecipes()
    };
    const addToFavorites = useCallback((getCurrentRecipeItem)=>{
        let copyFavorites = [...favorites];
        const index = copyFavorites.findIndex(item => item.id === getCurrentRecipeItem.id);
        if (index === -1) {
            copyFavorites.push(getCurrentRecipeItem)
            setFavorites(copyFavorites)
            ///save the favorites in local storage
            localStorage.setItem('favorites', JSON.stringify(copyFavorites))
            window.scrollTo({top: '0', behavior: 'smooth'})
        }
        else {
            alert('Item is already present in favorites')
        }
    },[favorites]);

    // const addToFavorites = (getCurrentRecipeItem) => {
    //     let copyFavorites = [...favorites]; ln
    //     const index = copyFavorites.findIndex(item => item.id === getCurrentRecipeItem.id);
    //     if (index === -1) {
    //         copyFavorites.push(getCurrentRecipeItem)
    //         setFavorites(copyFavorites)
    //         ///save the favorites in local storage
    //         localStorage.setItem('favorites', JSON.stringify(copyFavorites))
    //     }
    //     else {
    //         alert('Item is already present in favorites')
    //     }
    // };

    const removeFromFavorites = (getCurrentId) => {

        let copyFavorites = [...favorites];
        copyFavorites = copyFavorites.filter(item => item.id !== getCurrentId);
        setFavorites(copyFavorites);
        localStorage.setItem('favorites', JSON.stringify(copyFavorites));
    }

    useEffect(() => {
        const extractFavoritesFromLocalStorageOnPageLoad = JSON.parse(localStorage.getItem('favorites'))
        setFavorites(extractFavoritesFromLocalStorageOnPageLoad)
    }, [])
    console.log(filteredState, 'filteredState');

    //filter the favorites

    const filteredFavoritesItems = favorites.filter((item) =>
        item.title.toLowerCase().includes(filteredState.filteredValue)
    );

    const renderRecipes = useCallback(() => {
        if (recipes && recipes.length > 0) {
            return (
                recipes.map((item) => (<RecipeItem addToFavorites={() => addToFavorites(item)} id={item.id} image={item.image} title={item.title} />))
            )
        }
    }, [recipes,addToFavorites]);

    return (
        <div className="homepage">
            <Search getDataFromSearchComponent={getDataFromSearchComponent} dummydatacopy={dummydata}
                apiCalledSuccess={apiCalledSuccess}
                setApiCalledSuccess={setApiCalledSuccess}
            />
            {/*Show favorites items*/}
            <div className="favorites-wrapper">
                <h1 style={theme ? { color: "#12343b" } : {}} className="favorites-title">Favorites</h1>

                <div className="search-favorites">
                    <input
                        onChange={(event) =>
                            dispatch({ type: "filterFavorites", value: event.target.value })
                        }
                        value={filteredState.filteredValue}
                        name="search-favorites"
                        placeholder="Search Favorites" />
                </div>
                <div className="favorites">
                    {
                        !filteredFavoritesItems.length && <div style ={{display : "flex", width: "100%",justifyContent : "center"}}className="no-items">No favorites are found</div>
                    }
                    {
                        filteredFavoritesItems && filteredFavoritesItems.length > 0 ?
                            filteredFavoritesItems.map(item => (
                                <FavoriteItem
                                    removeFromFavorites={() => removeFromFavorites(item.id)}
                                    id={item.id} image={item.image} title={item.title}
                                />
                            ))
                            : null
                    }
                </div>
            </div>
            {/*Show favorites items*/}

            {/*show loading state*/}

            {
                loadingState && <div className="loading">Loading recipes ! Please wait</div>
            }

            {/*show loading state*/}


            {/*map through all the recipes*/}
            <div className="items">
                {
                    // renderRecipes()
                }
                {
                    useMemo(()=>(
                        !loadingState && recipes && recipes.length > 0 ?
                        recipes.map(item => <RecipeItem addToFavorites={() => addToFavorites(item)} id={item.id} image={item.image} title={item.title} />)
                        :null
                    ),[loadingState,recipes,addToFavorites])
                }
                {/* {
                    recipes && recipes.length > 0 ?
                        recipes.map(item => <RecipeItem addToFavorites={() => addToFavorites(item)} id={item.id} image={item.image} title={item.title} />)
                        : null
                } */}
            </div>

            {/*map through all the recipes*/}

            {
                !loadingState && !recipes.length && <div className="no-items">No recipes are found</div>
            }
        </div>
    );
};
export default Homepage;