import React from 'react';
import { Admin , Resource } from 'react-admin'
import DataProvider from './dataProvider'
import AuthProvider from './authProvider'
import WorkList from './Components/Works/workList'
import TypesList from './Components/Types/list'
import OrderList from './Components/Orders/list'
import UserList from './Components/Users/list'
import Dashboard from './Components/dashboard'
import CustomRoutes from './Components/customRoutes'
import NotFound from './Components/notFound'
import CategoriesList from './Components/Categories/catList'
import OrderShow from './Components/Orders/show'
import TypesCreate from './Components/Types/create'
import TypesEdit from './Components/Types/edit'
import CategoriesCreate from './Components/Categories/create'
import CategoriesEdit from './Components/Categories/edit'
import UserCreate from './Components/Users/create'
import UserShow from './Components/Users/show'
import WorkCreate from './Components/Works/create'
import workShow from './Components/Works/show'
import WorkEdit from './Components/Works/edit'
import UserEdit from './Components/Users/edit'
import {Provider} from 'react-redux'

//React admin - dependencies
import { createHashHistory } from 'history';

import store from './config/store';

//For redux dependencies
const dataProvider = DataProvider
const authProvider = AuthProvider
const history = createHashHistory();

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      call:''
    }
  }

  render(){
    console.log({
      authProvider,
      dataProvider,
      history,
      })
    return (
      <Provider store={store({
        authProvider,
        dataProvider,
        history,
        })}
      >
        <Admin dataProvider={DataProvider} authProvider={AuthProvider} dashboard={Dashboard} history={history} customRoutes={CustomRoutes} catchAll={NotFound} title='Sourceo'>
          <Resource name='orders' list={OrderList} show={OrderShow} options={{ label: 'Orders' }}/>
          <Resource name='works' list={WorkList} create={WorkCreate} show={workShow} edit={WorkEdit} options={{ label: 'Works' }}/>
          <Resource name='users' list={UserList} show={UserShow} edit={UserEdit} options={{ label: 'Users' }} create={UserCreate}/>
          <Resource name='categories' list={CategoriesList} options={{ label: 'Categories' }} create={CategoriesCreate} edit={CategoriesEdit}/>
          <Resource name='types' list={TypesList} options={{ label: 'Types' }} create={TypesCreate} edit={TypesEdit}/>
        </Admin>
      </Provider>
    );
  }
}

export default App;
