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
Route.get('/login', 'App/Controllers/AdminController.index')
Route.post('/loginDash', 'App/Controllers/AdminController.login')
Route.get('/logout', 'App/Controllers/AdminController.logout')
Route.get('/getUsers', 'App/Controllers/Ws/UserController.get').middleware('auth:jwt', 'role:Admin')
Route.post('/createUsers', 'App/Controllers/Ws/UserController.create')
Route.post('/loginUser', 'App/Controllers/Ws/UserController.login')
Route.group(() => {
  Route.get('/dash', 'App/Controllers/AdminController.dash')
}).middleware('role:Admin')
