import {createRoot} from 'react-dom/client';
import {createRouter,RouterProvider} from '@tanstack/react-router';
import {Route as root} from './routes/__root';
import {Route as home} from './routes/index';
import {Route as decisions} from './routes/decisions';
import './styles.css';
const router=createRouter({routeTree:root.addChildren([home,decisions]),basepath:import.meta.env.BASE_URL.replace(/\/$/,''),scrollRestoration:true});
declare module '@tanstack/react-router'{interface Register{router:typeof router}}
// The development HTML is named app.html so built index.html can stay ready for Pages.
if(location.pathname.endsWith('/app.html'))history.replaceState(null,'',import.meta.env.BASE_URL);
createRoot(document.getElementById('root')!).render(<RouterProvider router={router}/>);
