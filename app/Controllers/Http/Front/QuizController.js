'use strict'
const Database = use('Database')
const Exam = use('App/Models/Examtype')
const Quiz = use('App/Models/Quiz')
const Question = use('App/Models/Quizquestion')
const { validate } = use('Validator')

class QuizController {

  async getQuizList({ view, response }){
    const data = await Quiz.query().has('questions').where('startDate', '<=', Database.raw('NOW()')).where('endDate', '>=', Database.raw('NOW()')).fetch()
    //return response.send(data.toJSON())
    return view.render('front/quiz', {quiz: data.toJSON()})
  }

  async attemptQuiz({ params, view, response }){
    const { id } = params
    const quizData = await Quiz.find(id)
    const question = await Question.query().where('quiz_id', id).fetch()
    return view.render('front/attemptQuiz', { quizData: quizData.toJSON(), questions: question.toJSON() })
  }
}

module.exports = QuizController
