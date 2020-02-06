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

Route.on('/').render('front/home')
Route.on('/login').render('front/login')

Route.group(() => {
  Route.on('/posts').render('front/posts')
}).middleware('role:User')

Route.post('/login-action', 'App/Controllers/Http/Front/UserController.login')

Route.group(() => {
  Route.get('/getUsers', 'App/Controllers/Ws/UserController.get').middleware('auth:jwt', 'role:Admin')
  Route.post('/createUsers', 'App/Controllers/Ws/UserController.create')
  Route.post('/loginUser', 'App/Controllers/Ws/UserController.login')
}).prefix('api')

Route.group(() => {
  Route.get('/', 'App/Controllers/Http/Admin/AdminController.index')
  Route.get('/login', 'App/Controllers/Http/Admin/AdminController.index')
  Route.post('/loginDash', 'App/Controllers/Http/Admin/AdminController.login')
  Route.get('/logout', 'App/Controllers/Http/Admin/AdminController.logout')
}).prefix('admin')

Route.group(() => {
  Route.get('/dash', 'App/Controllers/Http/Admin/AdminController.dash')
  Route.get('/list-users/:page?', 'App/Controllers/Http/Admin/UserController.listUsers')
  Route.get('/add-users', 'App/Controllers/Http/Admin/UserController.addUsersForm')
  Route.post('/insert-users', 'App/Controllers/Http/Admin/UserController.addUsers')
  Route.get('/edit-users/:id', 'App/Controllers/Http/Admin/UserController.editUser')
  Route.post('/update-users/:id', 'App/Controllers/Http/Admin/UserController.updateUser')
  Route.get('/delete-users/:id', 'App/Controllers/Http/Admin/UserController.deleteUser')
  Route.get('/list-examtypes/:page?', 'App/Controllers/Http/Admin/ExamController.listExamTypes')
  Route.get('/add-examtypes', 'App/Controllers/Http/Admin/ExamController.addExamTypeForm')
  Route.post('/insert-examtypes', 'App/Controllers/Http/Admin/ExamController.addExamType')
  Route.get('/edit-examtypes/:id', 'App/Controllers/Http/Admin/ExamController.editExamType')
  Route.post('/update-examtypes/:id', 'App/Controllers/Http/Admin/ExamController.updateExamType')
  Route.get('/delete-examtypes/:id', 'App/Controllers/Http/Admin/ExamController.deleteExamType')
  
}).prefix('admin').middleware('role:Admin')
