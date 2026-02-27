/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Advocacy from './pages/Advocacy';
import ArtistDashboard from './pages/ArtistDashboard';
import ArtistProfile from './pages/ArtistProfile';
import Artists from './pages/Artists';
import CollectorDashboard from './pages/CollectorDashboard';
import Courses from './pages/Courses';
import CreatorAddListing from './pages/CreatorAddListing';
import CreatorDashboard from './pages/CreatorDashboard';
import LandFood from './pages/LandFood';
import Language from './pages/Language';
import Materials from './pages/Materials';
import Mint from './pages/Mint';
import NFTDetail from './pages/NFTDetail';
import PhysicalMarket from './pages/PhysicalMarket';
import Services from './pages/Services';
import SevaHub from './pages/SevaHub';
import SevaProject from './pages/SevaProject';
import Tourism from './pages/Tourism';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Advocacy": Advocacy,
    "ArtistDashboard": ArtistDashboard,
    "ArtistProfile": ArtistProfile,
    "Artists": Artists,
    "CollectorDashboard": CollectorDashboard,
    "Courses": Courses,
    "CreatorAddListing": CreatorAddListing,
    "CreatorDashboard": CreatorDashboard,
    "LandFood": LandFood,
    "Language": Language,
    "Materials": Materials,
    "Mint": Mint,
    "NFTDetail": NFTDetail,
    "PhysicalMarket": PhysicalMarket,
    "Services": Services,
    "SevaHub": SevaHub,
    "SevaProject": SevaProject,
    "Tourism": Tourism,
}

export const pagesConfig = {
    mainPage: "Advocacy",
    Pages: PAGES,
    Layout: __Layout,
};