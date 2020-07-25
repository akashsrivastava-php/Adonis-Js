'use strict'

const Exam = use('App/Models/Examtype')
const Quiz = use('App/Models/Quiz')
const Question = use('App/Models/Quizquestion')
const { validate } = use('Validator')

class QuizController {

  async addQuiz({view}){
    const allcourse = await Exam.query().with('exams').fetch()
    return view.render('admin/quiz/add', {courses: allcourse.toJSON()})
  }

  async insertQuiz({request, response, session}){
    const { name, exam, startDate, endDate } = request.all()
    const rules = {
        name: 'required',
        exam: 'required',
        startDate: 'required',
        endDate: 'required'
      }
      const validation = await validate(request.all(), rules)
      if(validation.fails()){
        session.withErrors(validation.messages())
        return response.redirect('back')
      }else{
        const quiz = new Quiz()
        quiz.name = name
        quiz.exam_id = exam
        quiz.startDate = startDate
        quiz.endDate = endDate
        await quiz.save()
        return response.redirect('/admin/list-quiz')
      }
  }

  async listQuiz({view, params, request, response}){
    const query = request.get()
    const page = params.page ? params.page : 1
    const data = await Quiz
    .query()
    .where(function () {
      if(query.search){
        this
        .where(query.search, 'LIKE', '%'+query.keyword+'%')
      }
    }).paginate(page,10)
    return view.render('admin/quiz/list', {data: data.toJSON()})
  }

  async editQuiz({params,view}){
    const quiz = await Quiz.find(params.id)
    const allcourse = await Exam.query().with('exams').fetch()
    return view.render('admin/quiz/edit', {quiz: quiz.toJSON(), courses: allcourse.toJSON()})
  }

  async updateQuiz({params,response,session,request}){
    const { name, exam, startDate, endDate } = request.all()
    const rules = {
      name: 'required',
      exam: 'required',
      startDate: 'required',
      endDate: 'required'
    }
    const validation = await validate(request.all(), rules)
    if(validation.fails()){
      session.withErrors(validation.messages())
      return response.redirect('back')
    }else{
      const id = params.id
      const quiz = await Quiz.find(id)
      quiz.name = name
      quiz.exam_id = exam
      quiz.startDate = startDate
      quiz.endDate = endDate
      await quiz.save()
      return response.redirect('/admin/list-quiz')
    }
  }

  async deleteQuiz({response, params}){
    const { id } = params
    const quiz = await Quiz.find(id)
    await quiz.delete()
    return response.redirect('/admin/list-quiz')
  }

  async listQuestion({params, view}){
    const { id } = params
    const question = await Question.query().where('quiz_id', id).fetch()
    const data = question.toJSON()
    return view.render('admin/quiz/list-question', {data, id})
  }

  async addQuestion({view, params}){
    const { id } = params
    return view.render('admin/quiz/add-question', {id: id})
  }

  async insertQuestion({request, response, session}){
    const { question, quiz_id, option_1, option_2, option_3, option_4, correct_option } = request.all()
    const rules = {
      question: 'required',
      option_1: 'required',
      option_2: 'required',
      option_3: 'required',
      option_4: 'required',
      correct_option: 'required',
    }
    const validation = await validate(request.all(), rules)
    if(validation.fails()){
      session.flashOnly(['question', 'quiz_id', 'option_1', 'option_2', 'option_3', 'option_4', 'correct_option'])
      session.withErrors(validation.messages())
      return response.redirect('back')
    }else{
      const quest = new Question()
      quest.question = question
      quest.quiz_id = quiz_id
      quest.option_1 = option_1
      quest.option_2 = option_2
      quest.option_3 = option_3
      quest.option_4 = option_4
      quest.correct_option = correct_option
      await quest.save()
      return response.redirect('/admin/quiz-question-list/'+quiz_id)
    }
  }

  async editQuestion({params, view}){
    const { id } = params
    const quest = await Question.find(id)
    return view.render('admin/quiz/edit-question', {data: quest.toJSON()}) 
  }

  async updateQuestion({params, response, session, request}){
    const { id } = params
    const { question, quiz_id, option_1, option_2, option_3, option_4, correct_option } = request.all()
    const rules = {
      question: 'required',
      option_1: 'required',
      option_2: 'required',
      option_3: 'required',
      option_4: 'required',
      correct_option: 'required',
    }
    const validation = await validate(request.all(), rules)
    if(validation.fails()){
      session.withErrors(validation.messages())
      return response.redirect('back')
    }else{
      const quest = await Question.find(id)
      quest.question = question
      quest.quiz_id = quiz_id
      quest.option_1 = option_1
      quest.option_2 = option_2
      quest.option_3 = option_3
      quest.option_4 = option_4
      quest.correct_option = correct_option
      await quest.save()
      return response.redirect('/admin/quiz-question-list/'+quiz_id)
    }
  }

  async deleteQuestion({ params, response }){
    const { id } = params
    const quiz = await Question.find(id)
    await quiz.delete()
    return response.redirect('back')
  }
}

module.exports = QuizController
