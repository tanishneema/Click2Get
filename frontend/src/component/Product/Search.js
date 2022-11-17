import React, { useState, Fragment } from "react";
import MetaData from "../layout/MetaData";
import "./Search.css";
import { useNavigate } from "react-router-dom";

const Search = () => {
    let navigate=useNavigate();
    const [keyword, setKeyword] = useState("");
    const k=keyword.toLowerCase();
    const searchSubmitHandler = (e) => {
        e.preventDefault();
        if (k.trim()) {
            navigate(`/products/${k}`);
        } else {
            navigate("/products");
        }
    };

    return (
        <Fragment>
            <MetaData title="Search - C2G" />
            <form className="searchBox" onSubmit={searchSubmitHandler}>
                <input
                    type="text"
                    placeholder="Search a Product ..."
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <input type="submit" value="Search" />
            </form>
        </Fragment>
    );
}; 

export default Search;