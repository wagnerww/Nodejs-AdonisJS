'use strict'

const Route = use('Route')

Route.post('users', 'UserController.store').validator('User')
Route.post('session', 'SessionController.store').validator('Session')

Route.post('passwords', 'ForgotPasswordController.store').validator(
  'ForgotPassword'
)
Route.put('passwords', 'ForgotPasswordController.update').validator(
  'ResetPassword'
)

Route.get('/files/:id', 'FileController.show')

// Cria todas as rotas automaticamente
Route.group(() => {
  Route.post('/files', 'FileController.store')
  Route.resource('projects', 'ProjectController')
    .apiOnly()
    .validator(new Map([[['projects.store'], ['Projects']]]))
  Route.resource('projects.tasks', 'TaskController')
    .apiOnly()
    .validator(new Map([[['projects.tasks.store'], ['Tasks']]]))
}).middleware(['auth'])
