'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')
Route.get('/login', 'App/Controllers/Http/AdminController.index')
Route.post('/loginDash', 'App/Controllers/Http/AdminController.login')
Route.get('/logout', 'App/Controllers/Http/AdminController.logout')
Route.get('/getUsers', 'App/Controllers/Ws/UserController.get').middleware('auth:jwt', 'role:Admin')
Route.post('/createUsers', 'App/Controllers/Ws/UserController.create')
Route.post('/loginUser', 'App/Controllers/Ws/UserController.login')
Route.group(() => {
  Route.get('/dash', 'App/Controllers/Http/AdminController.dash')
  Route.get('/list-users', 'App/Controllers/Http/UserController.listUsers')
  Route.get('/add-from-users', 'App/Controllers/Http/UserController.addUsersForm')
  Route.post('/add-users', 'App/Controllers/Http/UserController.addUsers')
  Route.get('/edit-users/:id', 'App/Controllers/Http/UserController.editUser')
  Route.post('/update-users/:id', 'App/Controllers/Http/UserController.updateUser')
  Route.get('/delete-users/:id', 'App/Controllers/Http/UserController.deleteUser')
}).middleware('role:Admin')
