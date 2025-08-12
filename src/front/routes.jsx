import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { Layout } from "./pages/Layout.jsx";
import { Home } from "./pages/Home.jsx";
import { Single } from "./pages/Single.jsx";
import { Error404 } from "./pages/Error404.jsx"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx";
import Huts from "./pages/Huts.jsx"
import Bookings from "./pages/Bookings.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { MapPage } from "./pages/MapPage.jsx";
import { SingleHut } from './pages/SingleHut';
import { Contact } from "./pages/Contact.jsx"
import { Profile } from "./pages/Profile.jsx";
import { EditProfile } from "./pages/EditProfile.jsx";
import { CurrentBooking } from "./pages/CurrentBooking.jsx";
import HutForm from "./components/HutForm.jsx";
import { Favorites } from "./pages/Favorites.jsx";
import { TermsAndConditions } from "./pages/Termsandconditions.jsx";
import { PrivacyPolicy } from "./pages/PrivacyPolicy.jsx";
import { UserReviews } from "./pages/UserReviews.jsx";
import { Reviews } from "./pages/Reviews.jsx";

/* 
CreateRoutesFromElements function allows you to build route elements declaratively.
Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
Root, on the contrary, create a sister Route, if you have doubts, try it!
Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.
*/
export const router = createBrowserRouter(
  createRoutesFromElements(
    // Root Route: All navigation will start from here.
    <Route path="/" element={<Layout />} errorElement={<Error404 />} >
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/huts" element={<Huts />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/maps" element={<MapPage />} />
      <Route path="/huts/:id" element={<SingleHut />} />
      <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
      <Route path="/current-booking/:id" element={<CurrentBooking />} />
      <Route path="/huts/new" element={<ProtectedRoute><HutForm /></ProtectedRoute>} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/termsandconditions" element={<TermsAndConditions />} />
      <Route path="/privacyandpolicy" element={<PrivacyPolicy />} />
      <Route path="/user-reviews" element={<UserReviews />} />
      <Route path="/reviews" element={<Reviews />} />
    </Route>
  )
);
