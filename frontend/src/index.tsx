import React from 'react';
import {ConfigProvider, theme} from 'antd';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
// import {Auth} from './features/auth/auth'; раскоментировать для анимации
import reportWebVitals from './reportWebVitals';
import { Paths } from './paths';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { Theaters } from './pages/theaters-dir/theaters';
import { AddTheaters } from './pages/theaters-dir/add-theaters';
import { Status } from './pages/status';
import { TheaterInfo } from './pages/theaters-dir/theater';
import { Shows } from './pages/shows-dir/shows';
import { EditTheater } from './pages/theaters-dir/edit-theaters';
import './index.css';
import { ShowInfo } from './pages/shows-dir/show';
import { AddShows } from './pages/shows-dir/add-shows';
import { EditShow } from './pages/shows-dir/edit-shows';
import { Schedule } from './pages/schedule-dir/schedule';
import { ScheduleItem } from './pages/schedule-dir/scheduleItem';
import { Cart } from './pages/cart';
import { Ticket } from './pages/ticket-info';
import { AddComment } from './pages/shows-dir/add-comment';
import { ActorInfo } from './pages/actors-dir/actor';
import { AddActor } from './pages/actors-dir/add-actor';
import { EditActor } from './pages/actors-dir/edit-actor';
import { AddScheduleItem } from './pages/schedule-dir/add-schedule-item';
import { UserInfo } from './pages/user-dir/user';
import { EditUser } from './pages/user-dir/edit-user';
import { ChangePassword } from './pages/user-dir/change-password-user';
import { AddArea } from './pages/theaters-dir/add-area';

const router = createBrowserRouter([
  {
    path: Paths.home,
    element: <Theaters/>
  },
  {
    path: Paths.login,
    element: <Login/>
  },
  {
    path: Paths.register,
    element: <Register/>
  },
  {
    path: Paths.addTheater,
    element: <AddTheaters/>
  },
  {
    path: `${Paths.status}/:status`,
    element: <Status/>
  },
  {
    path: `${Paths.getFullTheaterInfo}/:id`,
    element: <TheaterInfo />
  },
  {
    path: Paths.theaters,
    element: <Theaters/>
  },
  {
    path: `${Paths.updateTheater}/:id`,
    element: <EditTheater/>
  },
  {
    path: Paths.shows,
    element: <Shows/>
  },
  {
    path: Paths.addShow,
    element: <AddShows/>
  },
  {
    path: `${Paths.show}/:id`,
    element: <ShowInfo/>
  },
  {
    path: `${Paths.updateShows}/:id`,
    element: <EditShow/>
  },
  {
    path: Paths.schedule,
    element: <Schedule/>
  },
  {
    path: `${Paths.addScheduleItem}/:id`,
    element: <AddScheduleItem/>
  },
  {
    path: `${Paths.schedule}/:id`,
    element: <ScheduleItem/>
  },
  {
    path: `${Paths.ticket}/:id`,
    element: <Ticket/>
  },
  {
    path: Paths.cart,
    element: <Cart/>
  },
  {
    path: `${Paths.addComment}/:id`,
    element: <AddComment/>
  },
  {
    path: `${Paths.actor}/:id`,
    element: <ActorInfo/>
  },
  {
    path: `${Paths.updateActor}/:id`,
    element: <EditActor/>
  },
  {
    path: `${Paths.addActor}/:id`,
    element: <AddActor/>
  },
  {
    path: `${Paths.user}`,
    element: <UserInfo/>
  },
  {
    path: `${Paths.updateUser}`,
    element: <EditUser/>
  },
  {
    path: `${Paths.changePassword}`,
    element: <ChangePassword/>
  },
  {
    path: `${Paths.addArea}/:id`,
    element: <AddArea/>
  },
  // {
  //   path: `${Paths.deleteActor}/:id`,
  //   element: <ActorInfo/>
  // },
  // {
  //   path: `${Paths.}/:id`,
  //   element: <ShowInfo/>
  // },
]);
const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={{
        algorithm: theme.darkAlgorithm
      }}>
        {/* <Auth> раскоментировать для анимации*/}
          <RouterProvider router={router}/>
        {/* </Auth> */}
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
