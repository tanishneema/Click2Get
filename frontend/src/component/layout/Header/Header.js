import React from 'react';
import { ReactNavbar } from "overlay-navbar";
import logo from "../../../images/logo.png";
import { FaUser, FaSearch, FaShoppingCart } from "react-icons/fa";

const Header = () => {
    return (
        <ReactNavbar
            burgerColor="#222831"
            burgerColorHover="#222831"
            logo={logo}
            logoWidth="50vmax"
            navColor1="#DDDDDD"
            navColor2="#222831"
            logoHoverSize="10px"
            logoHoverColor="#F05454"
            link1Text="Home"
            link2Text="Products"
            link3Text="Contact"
            link4Text="About"
            link1Url="/"
            link2Url="/products"
            link3Url="/contact"
            link4Url="/about"
            link1Size="2.25vmax"
            link1Color="#DDDDDD"
            nav1justifyContent="center"
            nav2justifyContent="flex-start"
            nav3justifyContent="center"
            nav4justifyContent="center"
            link1ColorHover="#F05454"
            link2ColorHover="#F05454"
            link3ColorHover="#F05454"
            link4ColorHover="#F05454"
            link1Margin="2.5vmax"
            link2Margin="2.7vmax"
            link3Margin="2.7vmax"
            link4Margin="2vmax"
            profileIcon={true}
            cartIcon={true}
            searchIcon={true}
            profileIconUrl="/login"
            searchIconUrl="/search"
            cartIconUrl="/cart"
            ProfileIconElement={FaUser}
            SearchIconElement={FaSearch}
            CartIconElement={FaShoppingCart}
            profileIconColor="#DDDDDD"
            searchIconColor="#DDDDDD"
            cartIconColor="#DDDDDD"
            profileIconSize="2vmax"
            searchIconSize="2.2vmax"
            cartIconSize="2.2vmax"
            profileIconMargin="2vmax"
            searchIconMargin="2vmax"
            cartIconMargin="2vmax"
            profileIconColorHover="#F05454"
            searchIconColorHover="#F05454"
            cartIconColorHover="#F05454"
        />
    )
}

export default Header